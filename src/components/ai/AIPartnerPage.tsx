import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles, Send, Mic, MicOff, Plus, Search, Trash2, BookOpen,
  CheckSquare, Clock, Brain, Zap, Bell, ChevronDown, ChevronRight,
  LayoutGrid, MessageCircle, TrendingUp, Package, Users, IndianRupee,
  Lightbulb, BarChart3, Calendar, AlertCircle, CheckCircle2, XCircle,
  Info, Volume2, VolumeX, Download, RefreshCw, Shield, Eye,
} from 'lucide-react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { useApp } from '../../context/AppContext';
import {
  AIConversation, AIWorkspaceType, AIMessage, AIMessageAction,
  AIMemoryItem, AITaskReminder,
} from '../../types';
import { parseAIBusinessIntent } from '../../utils/aiAndOperationsLogic';

// ─── Workspace config ─────────────────────────────────────────────────────────
const WORKSPACES: { id: AIWorkspaceType; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { id: 'Daily Operations', label: 'Daily Operations', icon: LayoutGrid, color: 'emerald' },
  { id: 'Business Planning', label: 'Business Planning', icon: TrendingUp, color: 'blue' },
  { id: 'Finance & Accounts', label: 'Finance & Accounts', icon: IndianRupee, color: 'amber' },
  { id: 'Inventory & Manufacturing', label: 'Inventory & Mfg', icon: Package, color: 'violet' },
  { id: 'Personal Reminders', label: 'Personal Reminders', icon: Bell, color: 'rose' },
  { id: 'General Discussion', label: 'General Discussion', icon: MessageCircle, color: 'slate' },
];

const WORKSPACE_COLOR: Record<string, string> = {
  'Daily Operations': 'emerald',
  'Business Planning': 'blue',
  'Finance & Accounts': 'amber',
  'Inventory & Manufacturing': 'violet',
  'Personal Reminders': 'rose',
  'General Discussion': 'slate',
};

const colorClass = (color: string, variant: 'bg' | 'text' | 'border' | 'ring') => {
  const map: Record<string, Record<string, string>> = {
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', ring: 'ring-emerald-500' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700', ring: 'ring-blue-500' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700', ring: 'ring-amber-500' },
    violet: { bg: 'bg-violet-100 dark:bg-violet-950/60', text: 'text-violet-800 dark:text-violet-300', border: 'border-violet-300 dark:border-violet-700', ring: 'ring-violet-500' },
    rose: { bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-700', ring: 'ring-rose-500' },
    slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-600', ring: 'ring-slate-500' },
  };
  return map[color]?.[variant] ?? '';
};

// ─── Action Badge ─────────────────────────────────────────────────────────────
const ActionBadge: React.FC<{ type: 'REMEMBER' | 'REMIND' | 'EXECUTE' }> = ({ type }) => {
  const config = {
    REMEMBER: { label: 'REMEMBER', bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300', icon: Brain },
    REMIND: { label: 'REMIND', bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300', icon: Bell },
    EXECUTE: { label: 'EXECUTE', bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300', icon: Zap },
  }[type];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${config.bg}`}>
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
};

// ─── Action Card ─────────────────────────────────────────────────────────────
const ActionCard: React.FC<{
  action: AIMessageAction;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ action, onConfirm, onCancel }) => {
  const isPending = action.status === 'Pending';
  const isConfirmed = action.status === 'Confirmed' || action.status === 'Executed';
  const isCancelled = action.status === 'Cancelled';

  return (
    <div className={`mt-3 rounded-xl border p-3 text-xs transition-all ${
      isConfirmed ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40' :
      isCancelled ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 opacity-60' :
      'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40'
    }`}>
      <div className="flex items-start gap-2 justify-between mb-2">
        <div>
          <ActionBadge type={action.type} />
          <p className="mt-1.5 font-semibold text-slate-900 dark:text-white">{action.label}</p>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">{action.details}</p>
          {action.transactionRef && (
            <p className="text-emerald-700 dark:text-emerald-400 font-mono mt-1">Ref: {action.transactionRef}</p>
          )}
        </div>
        {isConfirmed && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
        {isCancelled && <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
      </div>
      {isPending && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors"
          >
            ✓ Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble: React.FC<{
  message: AIMessage;
  onConfirmAction: (msgId: string, actionId: string) => void;
  onCancelAction: (msgId: string, actionId: string) => void;
}> = ({ message, onConfirmAction, onCancelAction }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-5`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
        isUser
          ? 'bg-emerald-800 text-white'
          : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
      }`}>
        {isUser ? 'RG' : <Sparkles className="w-4 h-4" />}
      </div>

      <div className={`max-w-[78%] space-y-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-wrap ${
          isUser
            ? 'bg-emerald-800 text-white rounded-tr-sm'
            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm'
        }`}>
          {message.content}
        </div>

        {/* Action cards */}
        {message.actions && message.actions.map(action => (
          <div key={action.id} className="w-full">
            <ActionCard
              action={action}
              onConfirm={() => onConfirmAction(message.id, action.id)}
              onCancel={() => onCancelAction(message.id, action.id)}
            />
          </div>
        ))}

        <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1">{message.timestamp}</span>
      </div>
    </div>
  );
};

// ─── Thinking Indicator ───────────────────────────────────────────────────────
const ThinkingBubble: React.FC = () => (
  <div className="flex gap-3 mb-5">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
      <div className="flex gap-1.5 items-center">
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="text-[10px] text-slate-400 ml-1">Goyal AI is thinking...</span>
      </div>
    </div>
  </div>
);

// ─── Memory Item Card ─────────────────────────────────────────────────────────
const MemoryCard: React.FC<{ memory: AIMemoryItem; onDelete: () => void }> = ({ memory, onDelete }) => (
  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
    <div className="flex items-start justify-between gap-2 mb-1">
      <span className="font-semibold text-slate-900 dark:text-white leading-tight">{memory.title}</span>
      <button
        onClick={onDelete}
        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
        title="Delete memory"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-1.5">{memory.content}</p>
    <div className="flex items-center gap-1 flex-wrap">
      <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-medium">
        {memory.category}
      </span>
      {memory.tags.map(tag => (
        <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// ─── Task Card ────────────────────────────────────────────────────────────────
const TaskCard: React.FC<{ task: AITaskReminder; onToggle: () => void; onDelete: () => void }> = ({ task, onToggle, onDelete }) => {
  const priorityColor = { High: 'text-red-600', Medium: 'text-amber-600', Low: 'text-slate-500' }[task.priority];
  const isCompleted = task.status === 'Completed';
  return (
    <div className={`p-3 rounded-xl border text-xs transition-all ${
      isCompleted
        ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 opacity-60'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
    }`}>
      <div className="flex items-start gap-2">
        <button
          onClick={onToggle}
          className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            isCompleted ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold leading-tight ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-slate-500">{task.dueDateTime}</span>
            <span className={`font-semibold ${priorityColor}`}>{task.priority}</span>
          </div>
        </div>
        <button onClick={onDelete} className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// ─── Suggested Prompts ────────────────────────────────────────────────────────
const SUGGESTED_PROMPTS: Record<AIWorkspaceType, string[]> = {
  'Daily Operations': [
    'Warehouse 1 mein aaj kya aaya?',
    'Aaj ki production status batao',
    'Pending dispatches kaun se hain?',
  ],
  'Business Planning': [
    'New product launch ke liye plan banao',
    'Winter season strategy suggest karo',
    'Dealer network expand kaise karein?',
  ],
  'Finance & Accounts': [
    'Is month ka profit kitna hai?',
    'Kaun se customers ka payment overdue hai?',
    'GST liability calculate karo',
  ],
  'Inventory & Manufacturing': [
    'Low stock products kaun se hain?',
    'Reorder recommendations do',
    'Production batch status batao',
  ],
  'Personal Reminders': [
    'Kal 10 baje supplier ko call karna',
    'CA meeting schedule karo',
    'Bank work yaad dilana',
  ],
  'General Discussion': [
    'Business expansion ke options kya hain?',
    'Market mein competitors kaun hain?',
    'Digital marketing ideas do',
  ],
};

// ─── Daily Briefing Data ──────────────────────────────────────────────────────
const DailyBriefing: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { invoices, products, customers, tasks } = useEnterprise();

  const todaySales = invoices
    .filter(inv => inv.invoiceDate === new Date().toLocaleDateString('en-GB'))
    .reduce((s, inv) => s + inv.grandTotal, 0);

  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const lowStockCount = products.filter(p => p.currentStock <= p.minimumStock).length;
  const overdueCount = customers.filter(c => c.paymentStatus === 'Overdue').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Daily Business Briefing</h2>
              <p className="text-xs text-slate-500">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Today's Sales", value: `₹${todaySales.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'emerald' },
            { label: 'Pending Tasks', value: `${pendingTasks} tasks`, icon: Clock, color: 'amber' },
            { label: 'Low Stock Items', value: `${lowStockCount} products`, icon: Package, color: 'red' },
            { label: 'Overdue Payments', value: `${overdueCount} accounts`, icon: AlertCircle, color: 'rose' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
                <Icon className={`w-4 h-4 mb-1.5 text-${item.color}-600`} />
                <p className="text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
          <p className="text-indigo-800 dark:text-indigo-200 font-semibold mb-1">AI Recommendations</p>
          <ul className="space-y-1 text-indigo-700 dark:text-indigo-300">
            {lowStockCount > 0 && <li>• {lowStockCount} products need restocking – consider purchase orders today.</li>}
            {overdueCount > 0 && <li>• {overdueCount} customers have overdue payments – send reminders.</li>}
            {pendingTasks > 0 && <li>• {pendingTasks} tasks are pending – review your task list.</li>}
            {lowStockCount === 0 && overdueCount === 0 && <li>• All operations look healthy. Have a productive day! 🌟</li>}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
        >
          Start My Day
        </button>
      </div>
    </div>
  );
};

// ─── Main AI Partner Page ─────────────────────────────────────────────────────
export const AIPartnerPage: React.FC = () => {
  const {
    conversations, activeAIWorkspace, setActiveAIWorkspace,
    sendAIMessage, confirmAIAction, cancelAIAction,
    createAIConversation, deleteAIConversation,
    memories, deleteAIMemory,
    tasks, toggleAITask, deleteAITask,
  } = useEnterprise();

  const { activeRole, userProfile } = useApp();

  const [activeConvId, setActiveConvId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  );
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [rightPanel, setRightPanel] = useState<'memory' | 'tasks' | 'advisor' | null>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBriefing, setShowBriefing] = useState(false);
  const [showNewConvForm, setShowNewConvForm] = useState(false);
  const [newConvTitle, setNewConvTitle] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConvId) ?? null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isThinking]);

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.workspace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isThinking) return;
    const text = inputText.trim();
    setInputText('');
    setIsThinking(true);

    // If no active conversation, create one
    let convId = activeConvId;
    if (!convId) {
      const newConv = createAIConversation(
        text.length > 40 ? text.slice(0, 40) + '…' : text,
        activeAIWorkspace
      );
      convId = newConv.id;
      setActiveConvId(newConv.id);
    }

    try {
      await sendAIMessage(text, activeAIWorkspace, convId);
    } finally {
      setIsThinking(false);
    }
  }, [inputText, isThinking, activeConvId, activeAIWorkspace, createAIConversation, sendAIMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConfirm = (msgId: string, actionId: string) => {
    if (!activeConvId) return;
    confirmAIAction(activeConvId, msgId, actionId);
  };

  const handleCancel = (msgId: string, actionId: string) => {
    if (!activeConvId) return;
    cancelAIAction(activeConvId, msgId, actionId);
  };

  const handleNewConv = () => {
    const title = newConvTitle.trim() || `New Chat – ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const conv = createAIConversation(title, activeAIWorkspace);
    setActiveConvId(conv.id);
    setNewConvTitle('');
    setShowNewConvForm(false);
  };

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt);
    textareaRef.current?.focus();
  };

  const workspaceColor = WORKSPACE_COLOR[activeAIWorkspace] ?? 'emerald';

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">

      {/* ── LEFT PANEL: Conversation List ── */}
      <div className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-950 hidden md:flex">
        {/* Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Goyal AI Partner</span>
            </div>
            <button
              onClick={() => setShowBriefing(true)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600"
              title="Daily Briefing"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Demo mode badge */}
          <div className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
            <Info className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">Demo Mode – AI API not configured</span>
          </div>
        </div>

        {/* Workspace Selector */}
        <div className="p-2 border-b border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-1">Workspace</p>
          <div className="space-y-0.5">
            {WORKSPACES.map(ws => {
              const Icon = ws.icon;
              const isActive = activeAIWorkspace === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => setActiveAIWorkspace(ws.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 text-xs transition-colors ${
                    isActive
                      ? `${colorClass(ws.color, 'bg')} ${colorClass(ws.color, 'text')} font-semibold`
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{ws.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Search */}
        <div className="p-2 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* New conversation */}
        <div className="p-2 border-b border-slate-200 dark:border-slate-800">
          {showNewConvForm ? (
            <div className="space-y-1.5">
              <input
                autoFocus
                value={newConvTitle}
                onChange={e => setNewConvTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleNewConv(); if (e.key === 'Escape') setShowNewConvForm(false); }}
                placeholder="Conversation title..."
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-indigo-300 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <div className="flex gap-1">
                <button onClick={handleNewConv} className="flex-1 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold">Create</button>
                <button onClick={() => setShowNewConvForm(false)} className="flex-1 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewConvForm(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Conversation
            </button>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No conversations found</p>
          ) : (
            filteredConversations.map(conv => {
              const wsColor = WORKSPACE_COLOR[conv.workspace] ?? 'slate';
              const isActive = activeConvId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => { setActiveConvId(conv.id); setActiveAIWorkspace(conv.workspace); }}
                  className={`group px-2 py-2 rounded-lg cursor-pointer flex items-start gap-2 transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-${wsColor}-500`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate leading-tight">{conv.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{conv.updatedAt}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteAIConversation(conv.id); if (activeConvId === conv.id) setActiveConvId(null); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── CENTER: Chat ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className={`px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between ${colorClass(workspaceColor, 'bg')}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {activeConversation?.title ?? 'Goyal AI Partner'}
              </h2>
              <span className={`text-[10px] font-medium ${colorClass(workspaceColor, 'text')}`}>
                {activeAIWorkspace}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRightPanel(rightPanel === 'memory' ? null : 'memory')}
              className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 ${rightPanel === 'memory' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500'}`}
              title="Business Memory"
            >
              <Brain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Memory</span>
            </button>
            <button
              onClick={() => setRightPanel(rightPanel === 'tasks' ? null : 'tasks')}
              className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 ${rightPanel === 'tasks' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500'}`}
              title="Tasks & Reminders"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Tasks</span>
            </button>
            <button
              onClick={() => setShowBriefing(true)}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              title="Daily Briefing"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950/50">
          {!activeConversation ? (
            /* Welcome screen */
            <div className="h-full flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Goyal AI Partner
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Your intelligent business companion. Ask questions in Hindi, English, or Hinglish about your operations, finances, inventory, and more.
              </p>
              <div className="grid grid-cols-1 gap-2 w-full text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Try asking:</p>
                {SUGGESTED_PROMPTS[activeAIWorkspace].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-left text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {activeConversation.messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onConfirmAction={handleConfirm}
                  onCancelAction={handleCancel}
                />
              ))}
              {isThinking && <ThinkingBubble />}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Suggested prompts if conversation exists */}
        {activeConversation && !isThinking && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
            {SUGGESTED_PROMPTS[activeAIWorkspace].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-700 transition-colors bg-white dark:bg-slate-800 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message Goyal AI (${activeAIWorkspace})… (Enter to send, Shift+Enter for newline)`}
                rows={1}
                style={{ resize: 'none', minHeight: '40px', maxHeight: '120px' }}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                onInput={e => {
                  const el = e.target as HTMLTextAreaElement;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
                }}
              />
            </div>

            {/* Voice button */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isMicOn
                  ? 'bg-red-100 border-red-300 text-red-600'
                  : 'border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Voice input (Speech-to-text API not configured)"
            >
              {isMicOn ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isThinking}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Voice disclaimer */}
          {isMicOn && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400">
              <Info className="w-3 h-3 shrink-0" />
              Voice input requires Speech-to-Text API configuration. Currently in Demo Mode.
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL: Memory / Tasks ── */}
      {rightPanel && (
        <div className="w-72 shrink-0 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 hidden lg:flex">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => setRightPanel('tasks')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${rightPanel === 'tasks' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <CheckSquare className="w-3.5 h-3.5 inline mr-1" />Tasks
              </button>
              <button
                onClick={() => setRightPanel('memory')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${rightPanel === 'memory' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Brain className="w-3.5 h-3.5 inline mr-1" />Memory
              </button>
            </div>
            <button onClick={() => setRightPanel(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {rightPanel === 'tasks' && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {tasks.filter(t => t.status === 'Pending').length} Pending Tasks
                  </p>
                </div>
                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No tasks yet. Ask AI to set a reminder!</p>
                ) : (
                  tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => toggleAITask(task.id)}
                      onDelete={() => deleteAITask(task.id)}
                    />
                  ))
                )}
              </>
            )}

            {rightPanel === 'memory' && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Business Memory ({memories.length})</p>
                </div>
                {memories.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No memories saved. Tell AI to remember something!</p>
                ) : (
                  memories.map(mem => (
                    <MemoryCard
                      key={mem.id}
                      memory={mem}
                      onDelete={() => deleteAIMemory(mem.id)}
                    />
                  ))
                )}
              </>
            )}
          </div>

          {/* AI safety note */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-1.5 text-[10px] text-slate-400">
              <Shield className="w-3 h-3 shrink-0 mt-0.5" />
              <span>AI actions require your explicit confirmation. No data is modified without your approval.</span>
            </div>
          </div>
        </div>
      )}

      {/* Daily Briefing Modal */}
      {showBriefing && <DailyBriefing onClose={() => setShowBriefing(false)} />}
    </div>
  );
};
