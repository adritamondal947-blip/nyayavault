import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, FileText, ShieldCheck, Info } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import type { ChatMessage } from '@/types';

const suggested = [
  'Summarize this case.',
  'What documents mention CCTV evidence?',
  'Find witness statements related to Case 1023.',
  'What are the important dates in this case?',
  'Which forensic reports are associated with this case?',
];

const welcome: ChatMessage = {
  id: 'm-0',
  role: 'assistant',
  text: "Hello. I can help you find and understand information from your authorized case documents. Ask me about a case, a document type, or a specific piece of evidence.",
  time: 'now',
};

function answerFor(question: string): { text: string; sources?: string[] } {
  const q = question.toLowerCase();
  if (q.includes('summar')) {
    return {
      text: "CASE-2026-1023 concerns the theft of a registered motor vehicle from the Sector 14 parking area. The case includes the FIR, four witness statements, a forensic report on paint and tool marks, and a draft charge sheet. The case is currently Active and assigned to Officer A. Sharma.",
      sources: ['FIR_1023.pdf', 'Forensic_Report_1023.pdf', 'Charge_Sheet_1023.pdf'],
    };
  }
  if (q.includes('cctv')) {
    return {
      text: "One document mentions CCTV evidence: the CCTV analysis report from the Apex Trading investigation (CASE-2026-1041). It covers recovered and analyzed footage from the regional office.",
      sources: ['CCTV_Analysis_1041.pdf'],
    };
  }
  if (q.includes('witness')) {
    return {
      text: "There is one witness statement related to Case 1023: Witness_Statement_07.pdf, uploaded by A. Sharma on 19 Aug 2026. It describes suspicious activity observed near the scene on the night of the incident.",
      sources: ['Witness_Statement_07.pdf'],
    };
  }
  if (q.includes('date') || q.includes('important')) {
    return {
      text: "Key dates in CASE-2026-1023: 04 Jul 2026 — case created; 19 Aug 2026 — witness statement recorded; 20 Aug 2026 — forensic report uploaded; 21 Aug 2026 — FIR filed and integrity alert detected on the charge sheet.",
      sources: ['FIR_1023.pdf', 'Forensic_Report_1023.pdf', 'Charge_Sheet_1023.pdf'],
    };
  }
  if (q.includes('forensic')) {
    return {
      text: "Two forensic reports are associated with your cases: Forensic_Report_1023.pdf (paint and tool marks, Case 1023) and Device_Logs_0991.pdf (device log extraction, Case 0991 — Phishing Ring).",
      sources: ['Forensic_Report_1023.pdf', 'Device_Logs_0991.pdf'],
    };
  }
  return {
    text: "I could not find a direct answer to that question in your authorized documents. Try rephrasing, or ask about a specific case, document type, or keyword.",
  };
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, time: 'now' };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const ans = answerFor(text);
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', text: ans.text, sources: ans.sources, time: 'now' }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-6" style={{ minHeight: 'calc(100vh - 8rem)' }}>
      <PageHeader
        title="NyayaVault AI Assistant"
        description="Ask questions about documents you are authorized to access."
      />

      <div className="flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4">
        <ShieldCheck size={18} className="shrink-0 text-teal-600" />
        <p className="text-sm text-teal-800">
          AI answers are generated only from documents you are authorized to access.
        </p>
      </div>

      <Card padding="none" className="flex flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5 scrollbar-thin" style={{ maxHeight: '52vh' }}>
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                m.role === 'assistant' ? 'bg-navy-100 text-navy-600' : 'bg-navy-700 text-white'
              }`}>
                {m.role === 'assistant' ? <Sparkles size={17} /> : <span className="text-xs font-semibold">You</span>}
              </div>
              <div className={`max-w-[80%] ${m.role === 'user' ? 'items-end text-right' : ''}`}>
                <div className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-navy-700 text-white'
                    : 'bg-slate-50 text-navy-900'
                }`}>
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3 text-left">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Sources</p>
                    <div className="space-y-1.5">
                      {m.sources.map((s) => (
                        <div key={s} className="flex items-center gap-2 text-xs text-navy-700">
                          <FileText size={13} className="text-navy-400" /> {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {m.role === 'assistant' && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    AI-generated information should be verified against the original document.
                  </p>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-100 text-navy-600">
                <Sparkles size={17} />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-slate-50 px-4 py-3.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="border-t border-slate-100 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Try asking</p>
            <div className="flex flex-wrap gap-2">
              {suggested.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-100 p-4">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              rows={1}
              placeholder="Ask a question about your authorized documents..."
              className="max-h-32 flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white transition-colors hover:bg-navy-800 disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
