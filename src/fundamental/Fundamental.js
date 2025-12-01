import { useState } from 'react';
import JSXSyntax from './topics/JSXSyntax';
import Components from './topics/Components';
import Props from './topics/Props';
import State from './topics/State';
import Effects from './topics/Effects';
import EventHandling from './topics/EventHandling';
import ConditionalRendering from './topics/ConditionalRendering';
import ListsAndKeys from './topics/ListsAndKeys';
import ComponentComposition from './topics/ComponentComposition';
import RESTAPIBasics from './topics/RESTAPIBasics';
import FetchAPI from './topics/FetchAPI';
import AsyncAwait from './topics/AsyncAwait';
import JSONDataStructures from './topics/JSONDataStructures';
import MappingArrayData from './topics/MappingArrayData';
import LoadingErrorStates from './topics/LoadingErrorStates';
import APITransformation from './topics/APITransformation';
import EnvironmentVariables from './topics/EnvironmentVariables';
import PageSwitchButton from './PageSwitchButton';
import './Fundamental.css';

const topics = [
  { id: 'jsx', title: 'JSX Syntax', component: JSXSyntax },
  { id: 'components', title: 'Components', component: Components },
  { id: 'props', title: 'Props', component: Props },
  { id: 'state', title: 'State (useState)', component: State },
  { id: 'effects', title: 'Effects (useEffect)', component: Effects },
  { id: 'events', title: 'Event Handling', component: EventHandling },
  { id: 'conditional', title: 'Conditional Rendering', component: ConditionalRendering },
  { id: 'lists', title: 'Lists and Keys', component: ListsAndKeys },
  { id: 'composition', title: 'Component Composition', component: ComponentComposition },
  { id: 'rest-api', title: 'REST API Basics', component: RESTAPIBasics },
  { id: 'fetch-api', title: 'Fetch API & Promises', component: FetchAPI },
  { id: 'async-await', title: 'Async/Await Patterns', component: AsyncAwait },
  { id: 'json', title: 'JSON Data Structures', component: JSONDataStructures },
  { id: 'mapping', title: 'Mapping Array Data', component: MappingArrayData },
  { id: 'loading-error', title: 'Loading & Error States', component: LoadingErrorStates },
  { id: 'api-transform', title: 'API Transformation', component: APITransformation },
  { id: 'env-vars', title: 'Environment Variables', component: EnvironmentVariables },
];

function Fundamental() {
  const [activeTopic, setActiveTopic] = useState('jsx');

  const ActiveComponent = topics.find(t => t.id === activeTopic)?.component || JSXSyntax;

  return (
    <div className="fundamental-container">
      <PageSwitchButton />
      <header className="fundamental-header">
        <h1>React Fundamentals</h1>
        <p className="subtitle">Học các khái niệm cốt lõi của React</p>
      </header>

      <div className="fundamental-content">
        <nav className="fundamental-nav">
          <h2>Chủ đề</h2>
          <ul className="nav-list">
            {topics.map(topic => (
              <li key={topic.id}>
                <button
                  className={`nav-button ${activeTopic === topic.id ? 'active' : ''}`}
                  onClick={() => setActiveTopic(topic.id)}
                >
                  {topic.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="fundamental-main">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}

export default Fundamental;

