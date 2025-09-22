@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Link } from 'react-router-dom';
-import { moneySageAPI } from '../api/ai_agents';
-import { databaseAPI } from '../api/database';
-import { BudgetDonutChart } from '../components/BudgetChart';
-import LoadingSpinner from '../components/LoadingSpinner';
+import { moneySageAPI } from '../api/ai_agents.js';
+import { databaseAPI } from '../api/database.js';
+import { BudgetDonutChart } from '../components/BudgetChart.jsx';
+import LoadingSpinner from '../components/LoadingSpinner.jsx';
 import { AlertTriangle, TrendingUp, Shield, DollarSign, Target } from 'lucide-react';