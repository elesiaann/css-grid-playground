import { useState } from 'react';
import GridPlayground from './components/GridPlayground';
import CountryAccordionDemo from './components/demo';
import { cn } from './lib/utils';

type Tab = 'grid' | 'transfer';

const tabs: { id: Tab; label: string }[] = [
  { id: 'grid', label: 'CSS Grid Playground' },
  { id: 'transfer', label: 'Country Accordion' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('grid');

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Tab bar */}
      <nav className="flex-shrink-0 border-b border-border bg-card px-4 pt-3 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-200 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-primary text-primary bg-background'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'grid' && (
          <div className="h-full">
            <GridPlayground />
          </div>
        )}
        {activeTab === 'transfer' && (
          <div className="h-full overflow-y-auto">
            <CountryAccordionDemo />
          </div>
        )}
      </div>
    </div>
  );
}
