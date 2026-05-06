import { useState, useEffect, useRef } from 'react';

const templates: Record<string, { container: string; items: string; count: number }> = {
  basic: {
    container: `display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 1rem;\nheight: 100%;`,
    items: `background: rgba(187, 134, 252, 0.2);\nborder: 2px solid #bb86fc;\nborder-radius: 8px;\npadding: 2rem;`,
    count: 6,
  },
  'holy-grail': {
    container: `display: grid;\ngrid-template-columns: 200px 1fr 200px;\ngrid-template-rows: 80px 1fr 100px;\ngap: 10px;\nheight: 100%;`,
    items: `.grid-item:nth-child(1) { grid-column: 1 / 4; }\n.grid-item:nth-child(2) { grid-row: 2 / 3; }\n.grid-item:nth-child(5) { grid-column: 1 / 4; }`,
    count: 5,
  },
  mosaic: {
    container: `display: grid;\ngrid-template-columns: repeat(4, 1fr);\ngrid-auto-rows: 150px;\ngap: 15px;`,
    items: `.grid-item:nth-child(1) { grid-column: span 2; grid-row: span 2; }\n.grid-item:nth-child(2) { grid-column: span 2; }\n.grid-item:nth-child(6) { grid-column: span 3; }`,
    count: 8,
  },
  'twelve-column': {
    container: `display: grid;\ngrid-template-columns: repeat(12, 1fr);\ngap: 10px;`,
    items: `.grid-item:nth-child(1) { grid-column: span 12; }\n.grid-item:nth-child(2) { grid-column: span 4; }\n.grid-item:nth-child(3) { grid-column: span 8; }`,
    count: 4,
  },
  'auto-fill': {
    container: `display: grid;\ngrid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\ngap: 20px;`,
    items: `padding: 3rem;\nborder-radius: 12px;`,
    count: 8,
  },
};

const COLORS = [
  'linear-gradient(135deg, #6200ee, #bb86fc)',
  'linear-gradient(135deg, #03dac6, #018786)',
  'linear-gradient(135deg, #f44336, #e91e63)',
  'linear-gradient(135deg, #ff9800, #ffc107)',
  'linear-gradient(135deg, #4caf50, #8bc34a)',
  'linear-gradient(135deg, #2196f3, #00bcd4)',
  'linear-gradient(135deg, #9c27b0, #673ab7)',
  'linear-gradient(135deg, #795548, #9e9e9e)',
];

export default function GridPlayground() {
  const [containerCSS, setContainerCSS] = useState('');
  const [itemCSS, setItemCSS] = useState('');
  const [itemCount, setItemCount] = useState(8);
  const [selectedTemplate, setSelectedTemplate] = useState('basic');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const styleRef = useRef<HTMLStyleElement>(null);

  const applyTemplate = (key: string) => {
    const t = templates[key];
    if (!t) return;
    setContainerCSS(t.container);
    setItemCSS(t.items);
    setItemCount(t.count);
    setSelectedTemplate(key);
  };

  useEffect(() => {
    applyTemplate('basic');
  }, []);

  useEffect(() => {
    const finalCSS = `
      .pg-grid-container { ${containerCSS} }
      .pg-grid-item { ${itemCSS.includes('{') ? '' : itemCSS} }
      ${itemCSS.includes('{') ? itemCSS.replace(/\.grid-item/g, '.pg-grid-item') : ''}
    `;
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(finalCSS);
      if (styleRef.current) styleRef.current.textContent = finalCSS;
      setError('');
    } catch (e) {
      setError(`CSS Error: ${(e as Error).message}`);
    }
  }, [containerCSS, itemCSS]);

  const copyCSS = () => {
    const css = `/* Grid Container */\n.grid-container {\n${containerCSS}\n}\n\n/* Grid Items */\n.grid-item {\n${itemCSS}\n}`;
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: '#121212',
        color: '#e0e0e0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <style ref={styleRef} />

      {/* Header */}
      <header
        style={{
          height: 70,
          background: '#1e1e1e',
          borderBottom: '1px solid #2d2d2d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0,
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#bb86fc', letterSpacing: '-0.5px' }}>
          CSS Grid Playground
        </h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#a0a0a0' }}>Presets:</label>
            <select
              value={selectedTemplate}
              onChange={(e) => applyTemplate(e.target.value)}
              style={{ background: '#2d2d2d', color: '#e0e0e0', border: '1px solid #444', padding: '0.4rem 0.8rem', borderRadius: 4, outline: 'none', cursor: 'pointer' }}
            >
              <option value="basic">Basic 3-Column</option>
              <option value="holy-grail">Holy Grail Layout</option>
              <option value="mosaic">Mosaic Layout</option>
              <option value="twelve-column">12-Column System</option>
              <option value="auto-fill">Responsive Auto-fill</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setItemCount(c => c + 1)}
              style={{ padding: '0.4rem 0.9rem', borderRadius: 4, border: '1px solid #444', background: '#2d2d2d', color: '#e0e0e0', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
            >+</button>
            <button
              onClick={() => setItemCount(c => Math.max(1, c - 1))}
              style={{ padding: '0.4rem 0.9rem', borderRadius: 4, border: '1px solid #444', background: '#2d2d2d', color: '#e0e0e0', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
            >−</button>
          </div>
          <button
            onClick={copyCSS}
            style={{ padding: '0.5rem 1rem', borderRadius: 4, border: 'none', background: '#bb86fc', color: '#000', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}
          >
            {copied ? 'Copied!' : 'Copy CSS'}
          </button>
        </div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 1fr', overflow: 'hidden' }}>

        {/* Cheatsheet sidebar */}
        <aside style={{ background: '#1e1e1e', borderRight: '1px solid #2d2d2d', padding: '1.5rem', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: '1.5rem', letterSpacing: 1 }}>Grid Cheatsheet</h3>
          {[
            'display: grid;',
            'grid-template-columns: 1fr 1fr;',
            'gap: 10px;',
            'grid-column: 1 / 3;',
            'align-items: center;',
            'justify-items: center;',
          ].map((snippet) => (
            <CheatItem key={snippet} snippet={snippet} />
          ))}
        </aside>

        {/* Editor */}
        <section style={{ background: '#1e1e1e', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid #2d2d2d' }}>
          <EditorGroup
            label="Container Properties"
            selector=".grid-container"
            value={containerCSS}
            onChange={setContainerCSS}
            placeholder={`display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 1rem;`}
          />
          <EditorGroup
            label="Item Properties"
            selector=".grid-item"
            value={itemCSS}
            onChange={setItemCSS}
            placeholder={`background: #bb86fc;\npadding: 2rem;\nborder-radius: 8px;`}
          />
          {error && (
            <div style={{ background: 'rgba(207,102,121,0.1)', color: '#cf6679', padding: '0.8rem', borderRadius: 4, fontSize: '0.85rem', borderLeft: '3px solid #cf6679' }}>
              {error}
            </div>
          )}
        </section>

        {/* Preview */}
        <section
          style={{
            padding: '2rem',
            overflow: 'auto',
            backgroundImage: 'radial-gradient(circle at 1px 1px, #222 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        >
          <div className="pg-grid-container" style={{ minHeight: '100%' }}>
            {Array.from({ length: itemCount }, (_, i) => (
              <div
                key={i}
                className="pg-grid-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'rgba(255,255,255,0.9)',
                  background: COLORS[i % COLORS.length],
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  minHeight: 60,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CheatItem({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ background: '#121212', padding: '0.8rem', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
      <code style={{ fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: '0.8rem', color: '#03dac6', wordBreak: 'break-all' }}>{snippet}</code>
      <button
        onClick={() => { navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{ background: 'transparent', border: '1px solid #444', color: '#a0a0a0', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 3, cursor: 'pointer', alignSelf: 'flex-end' }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

function EditorGroup({ label, selector, value, onChange, placeholder }: { label: string; selector: string; value: string; onChange: (v: string) => void; placeholder: string; }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
        {label} (<code style={{ color: '#bb86fc' }}>{selector}</code>)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder={placeholder}
        style={{ flex: 1, background: '#121212', color: '#03dac6', border: '1px solid #2d2d2d', borderRadius: 6, padding: '1rem', fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: '0.9rem', resize: 'none', outline: 'none', lineHeight: 1.5, minHeight: 140 }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#bb86fc'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#2d2d2d'; }}
      />
    </div>
  );
}
