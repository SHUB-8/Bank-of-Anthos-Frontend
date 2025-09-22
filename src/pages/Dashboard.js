import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moneySageAPI } from '../api/ai_agents';
import { databaseAPI } from '../api/database';
import { BudgetDonutChart } from '../components/BudgetChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertTriangle, TrendingUp, Shield, DollarSign, Target } from 'lucide-react';

const Dashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [anomalySummary, setAnomalySummary] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [budgetsData, anomalyData, overviewData] = await Promise.all([
          moneySageAPI.getBudgets(),
          databaseAPI.fetchAnomalyLogSummary(),
          moneySageAPI.getOverview()
        ]);
        
        setBudgets(budgetsData.slice(0, 4)); // Top 4 budgets
        setAnomalySummary(anomalyData);
        setOverview(overviewData);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="opacity-90">Here's your financial overview for today</p>
      </div>

      {/* Quick Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">${overview.totalBudget}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${overview.totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Savings</p>
                <p className="text-2xl font-bold text-gray-900">${overview.currentSavings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{anomalySummary?.totalAnomalies || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Overview Widget */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
            <Link
              to="/budgets"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100;
              return (
                <div key={budget.id} className="text-center">
                  <BudgetDonutChart budget={budget} />
                  <div className="mt-3">
                    <h3 className="font-medium text-gray-900">{budget.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${budget.spent} / ${budget.limit}
                    </p>
                    <div className={`text-xs font-medium ${
                      percentage < 60 ? 'text-green-600' :
                      percentage < 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {percentage < 60 ? 'On Track' :
                       percentage < 80 ? 'Watch Out' : 'Over Budget'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Alerts Widget */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Security Alerts</h2>
            <Link
              to="/transactions?tab=security"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {anomalySummary ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">High Risk Alerts</p>
                    <p className="text-xs text-red-600">Require immediate attention</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-red-800">
                  {anomalySummary.highRisk}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Medium Risk Alerts</p>
                    <p className="text-xs text-yellow-600">Under review</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-yellow-800">
                  {anomalySummary.mediumRisk}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Low Risk Alerts</p>
                    <p className="text-xs text-green-600">Monitoring</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-800">
                  {anomalySummary.lowRisk}
                </span>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  Last updated: {new Date(anomalySummary.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">All systems secure</p>
              <p className="text-xs text-gray-500">No security alerts at this time</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/budgets"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Create Budget</span>
          </Link>
          
          <Link
            to="/transactions"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">View Transactions</span>
          </Link>
          
          <Link
            to="/contacts"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Manage Contacts</span>
          </Link>
          
          <Link
            to="/chat"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Ask AI Assistant</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;