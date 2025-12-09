'use client';

import React, { useState, useMemo } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Users, Target, DollarSign, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Types
interface User {
  id: number;
  name: string;
  email: string;
  churnProbability: number;
  ltv: number;
  riskLevel: 'high' | 'medium' | 'low';
  lastActivity: string;
  daysOnPlatform: number;
  runCount: number;
  runsLast30Days: number;
}

interface AnalyticsMetrics {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  avgChurnProbability: number;
  avgLtv: number;
  retentionRate: number;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Caio Teste',
    email: 'caio@gmail.com',
    churnProbability: 0.78,
    ltv: 150.0,
    riskLevel: 'high',
    lastActivity: '2025-12-01',
    daysOnPlatform: 0,
    runCount: 0,
    runsLast30Days: 0,
  },
  {
    id: 2,
    name: 'João Silva',
    email: 'joao@email.com',
    churnProbability: 0.45,
    ltv: 320.0,
    riskLevel: 'medium',
    lastActivity: '2025-12-07',
    daysOnPlatform: 45,
    runCount: 12,
    runsLast30Days: 5,
  },
  {
    id: 3,
    name: 'Maria Santos',
    email: 'maria@email.com',
    churnProbability: 0.82,
    ltv: 100.0,
    riskLevel: 'high',
    lastActivity: '2025-11-20',
    daysOnPlatform: 30,
    runCount: 2,
    runsLast30Days: 0,
  },
  {
    id: 4,
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    churnProbability: 0.12,
    ltv: 650.0,
    riskLevel: 'low',
    lastActivity: '2025-12-08',
    daysOnPlatform: 120,
    runCount: 45,
    runsLast30Days: 12,
  },
  {
    id: 5,
    name: 'Ana Oliveira',
    email: 'ana@email.com',
    churnProbability: 0.35,
    ltv: 400.0,
    riskLevel: 'medium',
    lastActivity: '2025-12-06',
    daysOnPlatform: 90,
    runCount: 28,
    runsLast30Days: 8,
  },
  {
    id: 6,
    name: 'Lucas Ferreira',
    email: 'lucas@email.com',
    churnProbability: 0.08,
    ltv: 750.0,
    riskLevel: 'low',
    lastActivity: '2025-12-08',
    daysOnPlatform: 200,
    runCount: 95,
    runsLast30Days: 18,
  },
  {
    id: 7,
    name: 'Fernanda Gomes',
    email: 'fernanda@email.com',
    churnProbability: 0.65,
    ltv: 200.0,
    riskLevel: 'high',
    lastActivity: '2025-11-15',
    daysOnPlatform: 60,
    runCount: 8,
    runsLast30Days: 1,
  },
  {
    id: 8,
    name: 'Carlos Santos',
    email: 'carlos@email.com',
    churnProbability: 0.28,
    ltv: 520.0,
    riskLevel: 'medium',
    lastActivity: '2025-12-05',
    daysOnPlatform: 150,
    runCount: 52,
    runsLast30Days: 10,
  },
];

const getRiskColor = (risk: 'high' | 'medium' | 'low') => {
  switch (risk) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300';
  }
};

const getRiskEmoji = (risk: 'high' | 'medium' | 'low') => {
  switch (risk) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
  }
};

export default function ChurnLtvAnalytics() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'churn' | 'ltv'>('churn');
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular métricas
  const metrics: AnalyticsMetrics = useMemo(() => {
    const highRisk = mockUsers.filter((u) => u.riskLevel === 'high').length;
    const mediumRisk = mockUsers.filter((u) => u.riskLevel === 'medium').length;
    const lowRisk = mockUsers.filter((u) => u.riskLevel === 'low').length;

    const avgChurn = mockUsers.reduce((sum, u) => sum + u.churnProbability, 0) / mockUsers.length;
    const avgLtv = mockUsers.reduce((sum, u) => sum + u.ltv, 0) / mockUsers.length;
    const retention = ((mediumRisk + lowRisk) / mockUsers.length) * 100;

    return {
      highRiskCount: highRisk,
      mediumRiskCount: mediumRisk,
      lowRiskCount: lowRisk,
      avgChurnProbability: avgChurn,
      avgLtv: avgLtv,
      retentionRate: retention,
    };
  }, []);

  // Filtrar e ordenar usuários
  const filteredUsers = useMemo(() => {
    let filtered = mockUsers.filter((u) => (filterRisk === 'all' ? true : u.riskLevel === filterRisk));
    return filtered.sort((a, b) => (sortBy === 'churn' ? b.churnProbability - a.churnProbability : b.ltv - a.ltv));
  }, [filterRisk, sortBy]);

  // Paginação
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dados para gráficos
  const riskDistributionData = {
    labels: ['Alto Risco', 'Médio Risco', 'Baixo Risco'],
    datasets: [
      {
        data: [metrics.highRiskCount, metrics.mediumRiskCount, metrics.lowRiskCount],
        backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(251, 146, 60, 0.8)', 'rgba(34, 197, 94, 0.8)'],
        borderColor: ['rgba(239, 68, 68, 1)', 'rgba(251, 146, 60, 1)', 'rgba(34, 197, 94, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const churnTrendData = {
    labels: ['Dia 1', 'Dia 5', 'Dia 10', 'Dia 15', 'Dia 20', 'Dia 25', 'Dia 30'],
    datasets: [
      {
        label: 'Taxa de Churn (%)',
        data: [28, 32, 35, 34, 36, 38, 35],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const ltvDistributionData = {
    labels: ['$0-200', '$200-400', '$400-600', '$600-800', '$800+'],
    datasets: [
      {
        label: 'Quantidade de Usuários',
        data: [2, 3, 2, 1, 0],
        backgroundColor: ['rgba(239, 68, 68, 0.6)', 'rgba(251, 146, 60, 0.6)', 'rgba(234, 179, 8, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(34, 197, 94, 0.6)'],
        borderColor: ['rgba(239, 68, 68, 1)', 'rgba(251, 146, 60, 1)', 'rgba(234, 179, 8, 1)', 'rgba(59, 130, 246, 1)', 'rgba(34, 197, 94, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: { color: 'rgb(107, 114, 128)', font: { size: 12 } },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Churn & LTV Analytics</h1>
        <p className="text-muted-foreground">Análise de predição de churn e lifetime value dos usuários</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 text-sm font-medium">Alto Risco</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{metrics.highRiskCount}</p>
              <p className="text-xs text-red-600 mt-1">{((metrics.highRiskCount / mockUsers.length) * 100).toFixed(0)}% da base</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600 opacity-20" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 text-sm font-medium">Médio Risco</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{metrics.mediumRiskCount}</p>
              <p className="text-xs text-yellow-600 mt-1">{((metrics.mediumRiskCount / mockUsers.length) * 100).toFixed(0)}% da base</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-600 opacity-20" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">Baixo Risco</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{metrics.lowRiskCount}</p>
              <p className="text-xs text-green-600 mt-1">{((metrics.lowRiskCount / mockUsers.length) * 100).toFixed(0)}% da base</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Prob. Média Churn</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{(metrics.avgChurnProbability * 100).toFixed(0)}%</p>
              <p className="text-xs text-blue-600 mt-1">↑ +2% vs mês ant.</p>
            </div>
            <Target className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">LTV Médio</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">${metrics.avgLtv.toFixed(0)}</p>
              <p className="text-xs text-purple-600 mt-1">↑ +5% vs mês ant.</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-700 text-sm font-medium">Taxa Retenção</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{metrics.retentionRate.toFixed(0)}%</p>
              <p className="text-xs text-indigo-600 mt-1">↑ +3% vs mês ant.</p>
            </div>
            <Users className="w-8 h-8 text-indigo-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Distribuição de Risco</h2>
          <div className="h-64 flex items-center justify-center">
            <Pie data={riskDistributionData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm col-span-2">
          <h2 className="text-lg font-bold text-foreground mb-6">Trend de Churn (Últimos 30 dias)</h2>
          <div className="h-64">
            <Line data={churnTrendData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm col-span-3">
          <h2 className="text-lg font-bold text-foreground mb-6">Distribuição de LTV</h2>
          <div className="h-64">
            <Bar data={ltvDistributionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-foreground mr-2">Filtrar por Risco:</label>
              <select
                value={filterRisk}
                onChange={(e) => {
                  setFilterRisk(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
              >
                <option value="all">Todos</option>
                <option value="high">Alto Risco</option>
                <option value="medium">Médio Risco</option>
                <option value="low">Baixo Risco</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mr-2">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
              >
                <option value="churn">Churn Probabilidade</option>
                <option value="ltv">LTV</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Resultados: {filteredUsers.length} usuários</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Nome</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Risco</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Prob. Churn</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">LTV</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Ação</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{user.id}</td>
                  <td className="py-3 px-4 text-foreground">{user.name}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(user.riskLevel)}`}>
                      {getRiskEmoji(user.riskLevel)} {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground font-medium">{(user.churnProbability * 100).toFixed(0)}%</td>
                  <td className="py-3 px-4 text-foreground font-medium">${user.ltv.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-primary hover:text-primary/80 font-medium text-xs"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
          >
            ← Anterior
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                  page === currentPage
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'text-foreground bg-background border-border hover:bg-muted'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-96 overflow-y-auto shadow-lg">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">👤 {selectedUser.name} (ID: {selectedUser.id})</h2>
              <button onClick={() => setSelectedUser(null)} className="text-foreground hover:text-muted-foreground text-2xl">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Predição */}
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-bold text-foreground mb-4">📊 PREDIÇÃO: CHURN</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Probabilidade de Churn</p>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${selectedUser.churnProbability * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-bold text-foreground mt-1">{(selectedUser.churnProbability * 100).toFixed(2)}%</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className={`px-2 py-1 rounded ${getRiskColor(selectedUser.riskLevel)}`}>
                      {getRiskEmoji(selectedUser.riskLevel)} {selectedUser.riskLevel.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Informações do Usuário */}
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-bold text-foreground mb-4">👤 INFORMAÇÕES DO USUÁRIO</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dias na Plataforma</p>
                    <p className="text-foreground font-medium">{selectedUser.daysOnPlatform} dias</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total de Corridas</p>
                    <p className="text-foreground font-medium">{selectedUser.runCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Corridas (Últimos 30d)</p>
                    <p className="text-foreground font-medium">{selectedUser.runsLast30Days}</p>
                  </div>
                </div>
              </div>

              {/* LTV */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">💰 LIFETIME VALUE</h3>
                <p className="text-3xl font-bold text-primary">${selectedUser.ltv.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
                📧 Enviar Email
              </button>
              <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium">
                💰 Oferecer Desconto
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 text-sm font-medium"
              >
                ❌ Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
