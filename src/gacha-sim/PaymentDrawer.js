import { useMemo, useState } from "react";
import {
    BASE_CURRENCY,
    getBundleReward,
    SUPPORTED_CURRENCIES,
} from "./wallet";

const PAYMENT_METHODS = [
    { id: "visa", label: "Visa" },
    { id: "mastercard", label: "Mastercard" },
];

const sanitizeNumber = (value) => value.replace(/\D+/g, "");

const luhnCheck = (value) => {
    const digits = value.split("").reverse();
    const sum = digits.reduce((acc, digit, index) => {
        let num = parseInt(digit, 10);
        if (index % 2 === 1) {
            num *= 2;
            if (num > 9) {
                num -= 9;
            }
        }
        return acc + num;
    }, 0);
    return sum % 10 === 0;
};

const isVisa = (value) =>
    /^4\d{12}(\d{3})?(\d{3})?$/.test(value);
const isMastercard = (value) =>
    /^5[1-5]\d{14}$/.test(value);

const validateCardNumber = (value, method) => {
    const sanitized = sanitizeNumber(value);
    if (!/^\d+$/.test(sanitized)) {
        return false;
    }
    const visaValid = isVisa(sanitized);
    const masterValid = isMastercard(sanitized);
    const methodMatch =
        method === "visa" ? visaValid : masterValid;
    return methodMatch && luhnCheck(sanitized);
};

const validateExpiry = (value) =>
    /^((0[1-9])|(1[0-2]))\/\d{2}$/.test(value);

const validateCcv = (value) => /^\d{3,4}$/.test(value);

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const generateLuhnNumber = (prefixes, length) => {
    const prefix =
        prefixes[randomInt(0, prefixes.length - 1)];
    const bodyLength = length - prefix.length - 1;
    let number = prefix;
    for (let index = 0; index < bodyLength; index += 1) {
        number += String(randomInt(0, 9));
    }
    const reversed = `${number}`.split("").reverse();
    let sum = 0;
    for (
        let index = 0;
        index < reversed.length;
        index += 1
    ) {
        let digit = parseInt(reversed[index], 10);
        if (Number.isNaN(digit)) {
            digit = 0;
        }
        if (index % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return `${number}${checkDigit}`;
};

const generateRandomName = () => {
    const firstNames = [
        "Lena",
        "Aria",
        "Noah",
        "Mika",
        "Rin",
        "Evan",
    ];
    const lastNames = [
        "Frost",
        "Vale",
        "Nova",
        "Ash",
        "Kai",
        "Skye",
    ];
    const first =
        firstNames[randomInt(0, firstNames.length - 1)];
    const last =
        lastNames[randomInt(0, lastNames.length - 1)];
    return `${first} ${last}`;
};

function PaymentPanel({
    wallet,
    currency,
    onCurrencyChange,
    formatDisplay,
    selectedBundleId,
    onSelectBundle,
    onTopUp,
    convertToCny,
}) {
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [topUpInput, setTopUpInput] = useState("");
    const numericTopUp = Number(topUpInput) || 0;
    const equivalentCny = convertToCny(
        numericTopUp,
        currency
    );
    const canConvert =
        currency === BASE_CURRENCY || equivalentCny > 0;

    const handleTopUpSubmit = () => {
        const amount = Number(topUpInput);
        if (Number.isNaN(amount) || amount <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ");
            return;
        }
        const cnyValue = convertToCny(amount, currency);
        if (currency !== BASE_CURRENCY && cnyValue <= 0) {
            alert("Tỷ giá cho currency này chưa sẵn sàng");
            return;
        }
        onTopUp(cnyValue);
        setTopUpInput("");
        setIsTopUpOpen(false);
    };
    return (
        <div className="payment-panel">
            <div className="payment-panel__header">
                <label className="payment-panel__currency">
                    <select
                        value={currency}
                        onChange={(event) =>
                            onCurrencyChange(
                                event.target.value
                            )
                        }
                    >
                        {SUPPORTED_CURRENCIES.map(
                            (option) => (
                                <option
                                    key={option.code}
                                    value={option.code}
                                >
                                    {option.label}
                                </option>
                            )
                        )}
                    </select>
                </label>
                <div className="payment-panel__balance">
                    <span>
                        Balance:{" "}
                        {formatDisplay(
                            wallet.balance_cny,
                            currency
                        )}
                    </span>
                    <button
                        type="button"
                        className="payment-panel__balance-add"
                        onClick={() =>
                            setIsTopUpOpen(!isTopUpOpen)
                        }
                    >
                        +
                    </button>
                    {isTopUpOpen && (
                        <div className="payment-panel__topup">
                            <input
                                type="number"
                                min="0"
                                placeholder={`Amount in ${currency}`}
                                value={topUpInput}
                                onChange={(event) =>
                                    setTopUpInput(
                                        event.target.value
                                    )
                                }
                            />
                            <span className="payment-panel__topup-note">
                                {canConvert
                                    ? `≈ ¥${equivalentCny.toFixed(
                                          2
                                      )} CNY`
                                    : "Đang tải tỷ giá..."}
                            </span>
                            <div className="payment-panel__topup-actions">
                                <button
                                    type="button"
                                    onClick={
                                        handleTopUpSubmit
                                    }
                                    disabled={!canConvert}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsTopUpOpen(
                                            false
                                        );
                                        setTopUpInput("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="payment-panel__origeometry">
                    Origeometry:{" "}
                    {wallet.origeometry.toLocaleString()}
                </div>
            </div>
            <div className="payment-panel__bundles">
                {wallet.bundles_info.map((bundle) => {
                    const reward = getBundleReward(bundle);
                    const bonusValue =
                        bundle.return_first_bonus_available
                            ? bundle.return_first_bonus
                                  .origeometry
                            : bundle.return_bonus
                                  .origeometry;
                    return (
                        <button
                            key={bundle.id}
                            type="button"
                            className={`bundle-card${
                                selectedBundleId ===
                                bundle.id
                                    ? " is-selected"
                                    : ""
                            }`}
                            onClick={() =>
                                onSelectBundle(bundle.id)
                            }
                        >
                            <div className="bundle-card__name">
                                {bundle.name}
                            </div>
                            <div className="bundle-card__reward">
                                {reward} Origeometry
                            </div>
                            <div className="bundle-card__details">
                                {
                                    bundle.return_fixed
                                        .origeometry
                                }{" "}
                                + Bonus: {bonusValue}
                                {bundle.return_first_bonus_available && (
                                    <span className="bundle-card__badge">
                                        First bonus
                                    </span>
                                )}
                            </div>
                            <div className="bundle-card__price">
                                {formatDisplay(
                                    bundle.price_cny,
                                    currency
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function CheckoutPanel({
    wallet,
    selectedBundle,
    currency,
    formatDisplay,
    onCheckout,
    isRateLoading,
}) {
    const [selectedMethod, setSelectedMethod] = useState(
        PAYMENT_METHODS[0].id
    );
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiry, setExpiry] = useState("");
    const [ccv, setCcv] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const balanceEnough = useMemo(() => {
        if (!selectedBundle) return false;
        return (
            wallet.balance_cny >= selectedBundle.price_cny
        );
    }, [wallet.balance_cny, selectedBundle]);

    const cardValid = useMemo(() => {
        if (!cardNumber || !expiry || !ccv) {
            return false;
        }
        return (
            validateCardNumber(
                cardNumber,
                selectedMethod
            ) &&
            validateExpiry(expiry) &&
            validateCcv(ccv)
        );
    }, [cardNumber, ccv, expiry, selectedMethod]);

    const handleFillRandom = () => {
        const isVisaMethod = selectedMethod === "visa";
        const card = isVisaMethod
            ? generateLuhnNumber(["4"], 16)
            : generateLuhnNumber(
                  ["51", "52", "53", "54", "55"],
                  16
              );
        const now = new Date();
        const month = randomInt(1, 12);
        const yearOffset = randomInt(1, 5);
        const year = (now.getFullYear() + yearOffset)
            .toString()
            .slice(-2);
        const paddedMonth = month
            .toString()
            .padStart(2, "0");
        const randomCcv = randomInt(100, 999).toString();
        setCardNumber(card);
        setCardHolder(generateRandomName());
        setExpiry(`${paddedMonth}/${year}`);
        setCcv(randomCcv);
    };

    const handleCheckout = async () => {
        if (!selectedBundle) {
            alert("Vui lòng chọn một bundle trước");
            return;
        }
        if (!balanceEnough) {
            alert(
                "Balance không đủ để thanh toán bundle này"
            );
            return;
        }
        if (!cardValid) {
            alert("Thông tin thẻ chưa hợp lệ");
            return;
        }
        setIsProcessing(true);
        try {
            await onCheckout({
                method: selectedMethod,
                bundleId: selectedBundle.id,
                paymentInfo: {
                    cardNumber,
                    cardHolder,
                    expiry,
                    ccv,
                },
            });
            setCardNumber("");
            setCardHolder("");
            setExpiry("");
            setCcv("");
        } finally {
            setIsProcessing(false);
        }
    };

    const totalDisplay = selectedBundle
        ? formatDisplay(selectedBundle.price_cny, currency)
        : formatDisplay(0, currency);

    const spentDisplay = formatDisplay(
        wallet.balance_cny_spent,
        currency
    );

    return (
        <div className="checkout-panel">
            <div className="checkout-panel__section">
                <div className="checkout-panel__label">
                    Payment method:
                </div>
                <div className="checkout-panel__methods">
                    {PAYMENT_METHODS.map((method) => (
                        <button
                            key={method.id}
                            type="button"
                            className={`checkout-panel__method${
                                selectedMethod === method.id
                                    ? " is-selected"
                                    : ""
                            }`}
                            onClick={() =>
                                setSelectedMethod(method.id)
                            }
                        >
                            {method.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="checkout-panel__section">
                <div className="checkout-panel__label">
                    Payment Information:
                </div>
                <input
                    type="text"
                    placeholder="Card number"
                    value={cardNumber}
                    onChange={(event) =>
                        setCardNumber(event.target.value)
                    }
                    autoComplete="cc-number"
                />
                <input
                    type="text"
                    placeholder="Name on card"
                    value={cardHolder}
                    onChange={(event) =>
                        setCardHolder(event.target.value)
                    }
                    autoComplete="cc-name"
                />
                <div className="checkout-panel__row">
                    <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(event) =>
                            setExpiry(event.target.value)
                        }
                        autoComplete="cc-exp"
                    />
                    <div className="checkout-panel__ccv-group">
                        <input
                            type="text"
                            placeholder="CCV"
                            value={ccv}
                            onChange={(event) =>
                                setCcv(event.target.value)
                            }
                            autoComplete="cc-csc"
                        />
                        <button
                            type="button"
                            className="checkout-panel__random"
                            onClick={handleFillRandom}
                            title="Random valid card info"
                        >
                            Rand
                        </button>
                    </div>
                </div>
            </div>
            <div className="checkout-panel__summary">
                <div className="checkout-panel__total">
                    Total: {totalDisplay}
                </div>
                <button
                    type="button"
                    className="checkout-panel__submit"
                    onClick={handleCheckout}
                    disabled={
                        !selectedBundle ||
                        !balanceEnough ||
                        !cardValid ||
                        isProcessing ||
                        isRateLoading
                    }
                >
                    Checkout
                </button>
                {!balanceEnough && selectedBundle && (
                    <span className="checkout-panel__error">
                        Balance không đủ
                    </span>
                )}
                {!cardValid && cardNumber && (
                    <span className="checkout-panel__error">
                        Kiểm tra lại thông tin thẻ
                    </span>
                )}
                <div className="checkout-panel__note">
                    Bạn đã sử dụng tổng cộng {spentDisplay}{" "}
                    để mua các bundles.
                </div>
            </div>
        </div>
    );
}

function PaymentDrawer({
    isOpen,
    onClose,
    wallet,
    currency,
    onCurrencyChange,
    formatDisplay,
    selectedBundleId,
    onSelectBundle,
    onTopUp,
    onCheckout,
    convertToCny,
    isRateLoading,
}) {
    const selectedBundle = useMemo(() => {
        if (!wallet) return null;
        return wallet.bundles_info.find(
            (bundle) => bundle.id === selectedBundleId
        );
    }, [selectedBundleId, wallet]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="payment-drawer">
            <div
                className="payment-drawer__backdrop"
                onClick={onClose}
            />
            <div className="payment-drawer__content">
                <div className="payment-drawer__head">
                    <h3>Payment & Checkout</h3>
                    <button
                        type="button"
                        className="payment-drawer__close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className="payment-drawer__body">
                    <PaymentPanel
                        wallet={wallet}
                        currency={currency}
                        onCurrencyChange={onCurrencyChange}
                        formatDisplay={formatDisplay}
                        selectedBundleId={selectedBundleId}
                        onSelectBundle={onSelectBundle}
                        onTopUp={onTopUp}
                        convertToCny={convertToCny}
                    />
                    <CheckoutPanel
                        wallet={wallet}
                        selectedBundle={selectedBundle}
                        currency={currency}
                        formatDisplay={formatDisplay}
                        onCheckout={onCheckout}
                        isRateLoading={isRateLoading}
                    />
                </div>
            </div>
        </div>
    );
}

export default PaymentDrawer;
