import { useMemo, useState } from 'react';
import TodoApp from './todo-app/TodoApp';
import WeatherPanel from './component/WeatherPanel';
import GitHubUserSearch from './github-search/GitHubUserSearch';
import GachaSim from './gacha-sim/GachaSim';
import PageSwitchButton from './component/PageSwitchButton';
import './App.css';

const workspaceModules = [
  {
    id: 'todo',
    label: 'Todo Workspace',
    description: 'Theo dõi, lọc và cập nhật tasks quan trọng.',
    component: TodoApp,
  },
  {
    id: 'github',
    label: 'GitHub Search',
    description: 'Truy vấn profile và repository mới nhất.',
    component: GitHubUserSearch,
  },
  {
    id: 'gacha',
    label: 'Gacha Sim',
    description: 'Mô phỏng tỷ lệ roll với kết quả trực quan.',
    component: GachaSim,
  },
];

function App() {
  const [activeModule, setActiveModule] = useState(workspaceModules[0].id);

  const activeConfig = useMemo(() => {
    return workspaceModules.find(module => module.id === activeModule) ?? workspaceModules[0];
  }, [activeModule]);

  const ActiveModuleComponent = activeConfig.component;

  return (
    <div className="app-shell">
      <PageSwitchButton label="React Fundamentals" target="fundamental" />

      <section className="app-section app-section--header">
        <WeatherPanel />
      </section>

      <section className="app-section app-section--workspace">
        <nav className="module-nav" aria-label="Workspace modules">
          <div className="module-nav__title">Module</div>
          <div className="module-nav__items">
            {workspaceModules.map(module => (
              <button
                key={module.id}
                type="button"
                className={`module-nav__item${module.id === activeModule ? ' is-active' : ''}`}
                onClick={() => setActiveModule(module.id)}
              >
                <span className="module-nav__item-label">{module.label}</span>
                <span className="module-nav__item-desc">{module.description}</span>
              </button>
            ))}
          </div>
        </nav>

        <div key={activeConfig.id} className="module-content">
          <ActiveModuleComponent />
        </div>
      </section>
    </div>
  );
}

export default App;
