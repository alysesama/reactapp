import { useEffect, useState } from "react";

const ENV_API_KEY =
    process.env.REACT_APP_OPENWEATHER_API_KEY;
const WEATHER_ENDPOINT =
    "https://api.openweathermap.org/data/3.0/onecall";
const REVERSE_GEOCODE_ENDPOINT =
    "https://api.openweathermap.org/geo/1.0/reverse";
const STORAGE_KEY = "weather_info";
const CACHE_DURATION = 1800; // 30 phút

const formatNumber = (value) =>
    typeof value === "number" ? value.toFixed(2) : "--";

const loadCachedWeather = () => {
    if (typeof window === "undefined") return null;
    try {
        const raw =
            window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            const now = Math.floor(Date.now() / 1000);
            if (
                data.next_refresh &&
                now < data.next_refresh
            ) {
                return data;
            }
        }
    } catch (error) {
        console.warn(
            "Không thể đọc dữ liệu weather_info từ localStorage:",
            error
        );
    }
    return null;
};

const loadRawWeatherCache = () => {
    if (typeof window === "undefined") return null;
    try {
        const raw =
            window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (error) {
        console.warn(
            "Không thể đọc raw weather_info từ localStorage:",
            error
        );
    }
    return null;
};

const saveWeatherToCache = (weatherData) => {
    if (typeof window === "undefined") return;
    try {
        const now = Math.floor(Date.now() / 1000);
        const existing = loadRawWeatherCache() || {};
        const data = {
            ...existing,
            ...weatherData,
            next_refresh: now + CACHE_DURATION,
        };
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
    } catch (error) {
        console.warn(
            "Không thể lưu dữ liệu weather_info vào localStorage:",
            error
        );
    }
};

function WeatherPanel() {
    const [coords, setCoords] = useState(null);
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [error, setError] = useState("");
    const [apiKeyInput, setApiKeyInput] = useState("");
    const [showApiKeyInput, setShowApiKeyInput] =
        useState(false);

    const fetchWeather = async (lat, lon, keyToUse) => {
        try {
            const weatherResponse = await fetch(
                `${WEATHER_ENDPOINT}?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${keyToUse}`
            );

            if (!weatherResponse.ok) {
                throw new Error(
                    "Không thể tải dữ liệu thời tiết."
                );
            }

            const weatherData =
                await weatherResponse.json();

            const locationResponse = await fetch(
                `${REVERSE_GEOCODE_ENDPOINT}?lat=${lat}&lon=${lon}&limit=1&appid=${keyToUse}`
            );
            console.log(locationResponse);

            let locationData = null;
            if (locationResponse.ok) {
                const [place] =
                    await locationResponse.json();
                if (place) {
                    locationData = {
                        city: place.name,
                        country: place.country,
                    };
                    setLocation(locationData);
                }
            }

            const weatherInfo = {
                temp: weatherData?.current?.temp ?? 0,
                description:
                    weatherData?.current?.weather?.[0]
                        ?.description ?? "Không xác định",
                timezone: weatherData?.timezone,
            };
            setWeather(weatherInfo);

            // Lưu vào localStorage
            saveWeatherToCache({
                coords: { lat, lon },
                weather: weatherInfo,
                location: locationData,
            });

            setStatus("success");
            setError("");
        } catch (err) {
            setStatus("error");
            setError(
                err.message ||
                    "Đã xảy ra lỗi khi tải dữ liệu thời tiết."
            );
            setShowApiKeyInput(true);
        }
    };

    useEffect(() => {
        // Lấy raw cache để đọc api_key (không phụ thuộc thời gian hết hạn)
        const rawCache = loadRawWeatherCache();
        const cachedApiKey = rawCache?.api_key || "";

        const effectiveApiKey =
            ENV_API_KEY || cachedApiKey || "";
        if (effectiveApiKey) {
            setApiKeyInput(effectiveApiKey);
        }

        // Kiểm tra cache thời tiết trước
        const cached = loadCachedWeather();
        if (cached) {
            setCoords(cached.coords);
            setWeather(cached.weather);
            setLocation(cached.location);
            setStatus("success");
            return;
        }

        // Nếu không có API key nào cả thì yêu cầu nhập
        if (!effectiveApiKey) {
            setStatus("error");
            setError(
                "Chưa có API key của OpenWeather. Vui lòng nhập bên dưới."
            );
            setShowApiKeyInput(true);
            return;
        }

        // Nếu không có cache hoặc đã hết hạn, lấy geolocation và fetch mới
        if (!navigator.geolocation) {
            setStatus("error");
            setError(
                "Trình duyệt không hỗ trợ xác định vị trí."
            );
            return;
        }

        setStatus("loading");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } =
                    position.coords;
                setCoords({
                    lat: latitude,
                    lon: longitude,
                });
                fetchWeather(
                    latitude,
                    longitude,
                    effectiveApiKey
                );
            },
            (geoError) => {
                setStatus("error");
                setError(
                    geoError.message ||
                        "Không thể truy cập vị trí. Hãy cấp quyền cho trình duyệt."
                );
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSaveApiKey = () => {
        const newKey = apiKeyInput.trim();
        if (!newKey) return;

        try {
            const existing = loadRawWeatherCache() || {};
            const updated = {
                ...existing,
                api_key: newKey,
            };
            if (typeof window !== "undefined") {
                window.localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(updated)
                );
            }
            setShowApiKeyInput(false);
            setStatus("loading");
            setError("");

            // Thử reload weather với API key mới
            if (coords) {
                fetchWeather(
                    coords.lat,
                    coords.lon,
                    newKey
                );
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } =
                            position.coords;
                        setCoords({
                            lat: latitude,
                            lon: longitude,
                        });
                        fetchWeather(
                            latitude,
                            longitude,
                            newKey
                        );
                    },
                    (geoError) => {
                        setStatus("error");
                        setError(
                            geoError.message ||
                                "Không thể truy cập vị trí. Hãy cấp quyền cho trình duyệt."
                        );
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                    }
                );
            } else {
                setStatus("error");
                setError(
                    "Trình duyệt không hỗ trợ xác định vị trí."
                );
            }
        } catch (e) {
            console.warn(
                "Không thể lưu API key vào localStorage:",
                e
            );
            setStatus("error");
            setError(
                "Không thể lưu API key vào localStorage."
            );
            setShowApiKeyInput(true);
        }
    };

    const renderContent = () => {
        if (status === "loading") {
            return (
                <div className="weather-loading">
                    Đang lấy dữ liệu thời tiết...
                </div>
            );
        }

        if (status === "error") {
            return (
                <div className="weather-error">
                    <div>{error}</div>
                    {showApiKeyInput && (
                        <div style={{ marginTop: 12 }}>
                            <div
                                style={{
                                    marginBottom: 4,
                                    fontWeight: 500,
                                }}
                            >
                                Nhập API key OpenWeather (sẽ
                                được lưu trong trình duyệt
                                của bạn):
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                }}
                            >
                                <input
                                    type="text"
                                    value={apiKeyInput}
                                    onChange={(e) =>
                                        setApiKeyInput(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nhập API key..."
                                    style={{
                                        flex: 1,
                                        padding: "6px 8px",
                                        borderRadius: 4,
                                        border: "1px solid #cbd5f5",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={
                                        handleSaveApiKey
                                    }
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: 4,
                                        border: "none",
                                        backgroundColor:
                                            "#2563eb",
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontWeight: 500,
                                    }}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (weather) {
            return (
                <>
                    <div className="weather-card__main">
                        <div className="weather-temp">
                            {Math.round(weather.temp)}°C
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    textTransform:
                                        "capitalize",
                                }}
                            >
                                {weather.description}
                            </div>
                            <div
                                style={{
                                    color: "#94a3b8",
                                    marginTop: 4,
                                }}
                            >
                                {location?.city ||
                                    "Không rõ"}
                                ,{" "}
                                {location?.country || "--"}
                            </div>
                        </div>
                    </div>

                    <div className="weather-meta">
                        <span>
                            <strong>Lat/Lon:</strong>{" "}
                            {formatNumber(coords?.lat)},{" "}
                            {formatNumber(coords?.lon)}
                        </span>
                        <span>
                            <strong>Múi giờ:</strong>{" "}
                            {weather.timezone || "--"}
                        </span>
                        <span>
                            <strong>Vị trí:</strong>{" "}
                            {location
                                ? `${location.city}, ${location.country}`
                                : "Đang cập nhật"}
                        </span>
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <div className="weather-card">
            {renderContent()}
        </div>
    );
}

export default WeatherPanel;
