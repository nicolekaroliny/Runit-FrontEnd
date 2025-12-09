'use client';

import React, { useEffect, useState } from 'react';
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
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { BlogService } from '@/lib/api/blogservice';
import { UserService } from '@/lib/api/userservice';
import { BlogPost, BlogCategory } from '@/types/blog.types';
import { TrendingUp, Users, FileText, Eye, MessageSquare, Calendar } from 'lucide-react';

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

interface AnalyticsData {
  totalViews: number;
  totalPosts: number;
  totalUsers: number;
  postsThisMonth: number;
  usersThisMonth: number;
  postsByCategory: { category: string; count: number }[];
  postsByStatus: { status: string; count: number };
  postsPerDay: { day: string; count: number }[];
  viewsTrend: { date: string; views: number }[];
}

export default function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [allPosts, categories, allUsers] = await Promise.all([
          BlogService.getAllAdminPosts(),
          BlogService.getAllCategories?.() || [],
          UserService.getAllUsers?.() || [],
        ]);

        // Calcular estatísticas
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Posts deste mês
        const postsThisMonth = allPosts.filter((post) => {
          const postDate = new Date(post.createdAt || '');
          return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
        }).length;

        // Usuários deste mês
        const usersThisMonth = allUsers.filter((user: any) => {
          const userDate = new Date(user.createdAt || '');
          return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
        }).length;

        // Posts por categoria
        const categoryMap: { [key: string]: number } = {};
        allPosts.forEach((post: BlogPost) => {
          post.categories?.forEach((cat: BlogCategory) => {
            categoryMap[cat.name] = (categoryMap[cat.name] || 0) + 1;
          });
        });
        const postsByCategory = Object.entries(categoryMap)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);

        // Posts por status
        const statusCount = {
          PUBLISHED: allPosts.filter((p) => p.status === 'PUBLISHED').length,
          DRAFT: allPosts.filter((p) => p.status === 'DRAFT').length,
          SCHEDULED: allPosts.filter((p) => p.status === 'SCHEDULED').length,
        };

        // Posts por dia (últimos 7 dias)
        const postsPerDay: { day: string; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
          const count = allPosts.filter(
            (post) =>
              post.createdAt &&
              post.createdAt.startsWith(dateStr)
          ).length;
          postsPerDay.push({ day: dayName, count });
        }

        // Trend de views (simulado com views aleatórias)
        const viewsTrend: { date: string; views: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          viewsTrend.push({
            date: dateStr,
            views: Math.floor(Math.random() * 500) + 100,
          });
        }

        setAnalytics({
          totalViews: Math.floor(Math.random() * 10000) + 1000,
          totalPosts: allPosts.length,
          totalUsers: allUsers.length,
          postsThisMonth,
          usersThisMonth,
          postsByCategory,
          postsByStatus: statusCount,
          postsPerDay,
          viewsTrend,
        });
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-muted-foreground">
        Erro ao carregar dados de analytics
      </div>
    );
  }

  // Cores para os gráficos
  const chartColors = {
    primary: 'rgb(59, 130, 246)',
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(251, 146, 60)',
    danger: 'rgb(239, 68, 68)',
    info: 'rgb(6, 182, 212)',
  };

  // Gráfico de Views (Linha)
  const viewsChartData = {
    labels: analytics.viewsTrend.map((item) => item.date),
    datasets: [
      {
        label: 'Visualizações',
        data: analytics.viewsTrend.map((item) => item.views),
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Gráfico de Posts por Dia (Barras)
  const postsChartData = {
    labels: analytics.postsPerDay.map((item) => item.day),
    datasets: [
      {
        label: 'Posts Criados',
        data: analytics.postsPerDay.map((item) => item.count),
        backgroundColor: [
          chartColors.primary,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
          chartColors.info,
          chartColors.primary,
          chartColors.success,
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Gráfico de Posts por Categoria (Doughnut)
  const categoryColors = [
    chartColors.primary,
    chartColors.success,
    chartColors.warning,
    chartColors.danger,
    chartColors.info,
  ];

  const categoryChartData = {
    labels: analytics.postsByCategory.map((item) => item.category),
    datasets: [
      {
        data: analytics.postsByCategory.map((item) => item.count),
        backgroundColor: categoryColors.slice(0, analytics.postsByCategory.length),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de Status (Pie)
  const statusChartData = {
    labels: ['Publicados', 'Rascunhos', 'Agendados'],
    datasets: [
      {
        data: [
          analytics.postsByStatus.PUBLISHED,
          analytics.postsByStatus.DRAFT,
          analytics.postsByStatus.SCHEDULED,
        ],
        backgroundColor: [chartColors.success, chartColors.warning, chartColors.info],
        borderColor: '#fff',
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
        labels: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
            weight: '500' as const,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analíticas</h1>
        <p className="text-muted-foreground">
          Visualize estatísticas e relatórios de desempenho da plataforma
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Visualizações</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {analytics.totalViews.toLocaleString('pt-BR')}
              </p>
            </div>
            <Eye className="w-8 h-8 text-primary opacity-20" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total de Posts</p>
              <p className="text-2xl font-bold text-foreground mt-2">{analytics.totalPosts}</p>
            </div>
            <FileText className="w-8 h-8 text-success opacity-20" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total de Usuários</p>
              <p className="text-2xl font-bold text-foreground mt-2">{analytics.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-info opacity-20" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Posts este Mês</p>
              <p className="text-2xl font-bold text-foreground mt-2">{analytics.postsThisMonth}</p>
            </div>
            <Calendar className="w-8 h-8 text-warning opacity-20" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Usuários este Mês</p>
              <p className="text-2xl font-bold text-foreground mt-2">{analytics.usersThisMonth}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-danger opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Trend Chart */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Trend de Visualizações</h2>
          <div className="h-80">
            <Line data={viewsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Posts per Day Chart */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Posts Criados (7 últimos dias)</h2>
          <div className="h-80">
            <Bar data={postsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Posts por Categoria</h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={categoryChartData} options={chartOptions} />
          </div>
        </div>

        {/* Status Chart */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Posts por Status</h2>
          <div className="h-80 flex items-center justify-center">
            <Pie data={statusChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Category Details Table */}
      {analytics.postsByCategory.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Detalhes por Categoria</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Posts</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Percentual</th>
                </tr>
              </thead>
              <tbody>
                {analytics.postsByCategory.map((cat, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{cat.category}</td>
                    <td className="py-3 px-4 text-muted-foreground">{cat.count}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(cat.count / Math.max(...analytics.postsByCategory.map((c) => c.count))) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(
                            (cat.count /
                              analytics.postsByCategory.reduce((sum, c) => sum + c.count, 0)) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
