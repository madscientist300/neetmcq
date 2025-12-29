import { useState } from 'react';
import { Eye, Edit3, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  showHelp?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder,
  rows = 6,
  required = false,
  showHelp = true,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showQuickHelp, setShowQuickHelp] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {showHelp && (
          <button
            type="button"
            onClick={() => setShowQuickHelp(!showQuickHelp)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            {showQuickHelp ? 'Hide' : 'Show'} Markdown Help
          </button>
        )}
      </div>

      {showQuickHelp && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-xs space-y-3 max-h-96 overflow-y-auto">
          <p className="font-semibold text-blue-900 dark:text-blue-200 text-sm mb-2">📝 Comprehensive Markdown & Math Guide</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 text-blue-800 dark:text-blue-300">
            <div className="border-b border-blue-200 dark:border-blue-700 pb-2">
              <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-100">✍️ Text Formatting:</p>
              <div className="space-y-1 ml-2 text-[11px]">
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">**bold text**</code> → <strong>bold text</strong></div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">*italic text*</code> → <em>italic text</em></div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">~~strikethrough~~</code> → <s>strikethrough</s></div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">`inline code`</code> → <code>inline code</code></div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">H~2~O</code> → H₂O (subscript)</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">x^2^</code> → x² (superscript)</div>
              </div>
            </div>

            <div className="border-b border-blue-200 dark:border-blue-700 pb-2">
              <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-100">📋 Lists:</p>
              <div className="space-y-1 ml-2 text-[11px]">
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">- Item 1</code> → Bullet list</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">1. Item 1</code> → Numbered list</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">  - Nested</code> → Nested item (2 spaces)</div>
              </div>
            </div>

            <div className="border-b border-blue-200 dark:border-blue-700 pb-2">
              <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-100">🧮 Math Equations (LaTeX):</p>
              <div className="space-y-1 ml-2 text-[11px]">
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$x + y = z$</code> → Inline equation</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$$E = mc^2$$</code> → Block equation</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$x^2$</code> → Superscript (x²)</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$H_2O$</code> → Subscript (H₂O)</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\frac{'{a}'}{'{b}'}$</code> → Fraction (a/b)</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\sqrt{'{x}'}$</code> → Square root</div>
              </div>
            </div>

            <div className="border-b border-blue-200 dark:border-blue-700 pb-2">
              <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-100">🔬 Scientific Notation:</p>
              <div className="space-y-1 ml-2 text-[11px]">
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$CO_2$</code> → CO₂</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$H_2SO_4$</code> → H₂SO₄</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$6.02 \times 10^{'{23}'}$</code> → 6.02 × 10²³</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\Delta H$</code> → ΔH</div>
              </div>
            </div>

            <div className="border-b border-blue-200 dark:border-blue-700 pb-2 lg:col-span-2">
              <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-100">📊 Tables:</p>
              <div className="space-y-1 ml-2 text-[11px]">
                <pre className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded overflow-x-auto">
                  {`| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell A1  | Cell B1  | Cell C1  |
| Cell A2  | Cell B2  | Cell C2  |`}
                </pre>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-100">🔤 Greek Letters:</p>
              <div className="space-y-1 ml-2 text-[11px]">
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\alpha$, $\beta$, $\gamma$</code></div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\theta$, $\pi$, $\Omega$</code></div>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-100">➡️ Symbols:</p>
              <div className="space-y-1 ml-2 text-[11px]">
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\rightarrow$</code> → Arrow</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\approx$</code> → Approximately</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\neq$</code> → Not equal</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">$\leq$, $\geq$</code> → ≤ and ≥</div>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-300 dark:border-blue-700 pt-2 mt-3">
            <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-100">💡 Example Usage:</p>
            <div className="space-y-2 text-[11px] ml-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                <p className="font-medium mb-1">Physics:</p>
                <code>The formula for kinetic energy is $KE = \frac{'{1}'}{'{2}'}mv^2$ where $m$ is mass and $v$ is velocity.</code>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                <p className="font-medium mb-1">Chemistry:</p>
                <code>The reaction is: $2H_2 + O_2 \rightarrow 2H_2O$</code>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                <p className="font-medium mb-1">Biology:</p>
                <code>Photosynthesis: $6CO_2 + 6H_2O + \text{'{light energy}'} \rightarrow C_6H_{'{12}'}O_6 + 6O_2$</code>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'edit'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'preview'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800">
          {activeTab === 'edit' ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              rows={rows}
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none font-mono text-sm"
              placeholder={placeholder}
            />
          ) : (
            <div className="px-4 py-3 min-h-[150px]">
              {value ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 markdown-preview">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">Nothing to preview yet. Start typing in the Edit tab.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Character Count */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{value.length} characters</span>
        <span className="flex items-center gap-1">
          <span className="hidden sm:inline">Switch to Preview tab to see formatted output</span>
          <span className="sm:hidden">Preview for formatted output</span>
        </span>
      </div>
    </div>
  );
}
