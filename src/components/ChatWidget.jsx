@@ .. @@
 import React, { useState, useRef, useEffect } from 'react';
 import { useLocation } from 'react-router-dom';
 import { MessageCircle, X, Send } from 'lucide-react';
-import { orchestratorAPI } from '../api/ai_agents';
+import { orchestratorAPI } from '../api/ai_agents.js';

export default React