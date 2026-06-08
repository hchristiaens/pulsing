import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronDown,
  Activity,
  History,
  AlertCircle,
  Home,
  ArrowLeft,
  Search,
  Filter,
  ExternalLink,
  Settings,
  Bell,
  Save,
  Trash2,
  Edit2,
  Shield,
  Zap,
  Target,
  Gauge,
  Globe,
  Layers,
  BarChart3,
  RefreshCw,
  Building,
  LayoutGrid,
  Plus,
  Power,
  X,
  AlertTriangle,
  PlusCircle,
  MoreVertical,
  Menu
} from 'lucide-react';
import { MetricHierarchy, AuditLogEntry, AppView, RAGStatus, Organization } from './types';
import { useMetrics } from './hooks/useMetrics';
import { MetricCard } from './components/MetricCard';
import { MetricDetailHeader } from './components/MetricDetailHeader';
import { calculateStatus } from './services/metricService';
import { cn } from './lib/utils';

export default function App() {
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const { hierarchy, setHierarchy, loading, refreshData } = useMetrics(currentOrgId);
  const [activeView, setActiveView] = useState<AppView>('org-selection');
  const [selectedDetailMetricId, setSelectedDetailMetricId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'EN' | 'NL' | 'FR' | 'ES' | 'DE'>('EN');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const translations = {
    EN: {
      dashboard: "Dashboard",
      configuration: "Configuration",
      orgSelection: "Select Organizational Unit",
      searchPlaceholder: "Search units or codes...",
      activeUnitsOnly: "Show Active Units Only",
      initializing: "Initializing Cockpit Systems...",
      cockpitTitle: "pulsING COCKPIT DASHBOARD",
      configTitle: "Configuration Engine",
      language: "Language",
      theme: "Theme",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      auditVault: "Audit Vault Drawer",
      recentActivity: "Recent Activity Pulse",
      noRecentActivity: "No recent configuration changes recorded for this unit.",
      root: "Root",
      levelUp: "Level Up",
      back: "Back",
      addOrg: "Add Organization",
      editOrg: "Edit Organization",
      deleteOrg: "Delete Organization",
      save: "Save Changes",
      cancel: "Cancel",
      owner: "Owner / Accountable",
      type: "Type",
      teamCode: "Team Code",
      description: "Description",
      title: "Title",
      active: "Active",
      disabled: "Disabled",
      apiAdvice: "API ADVICE: not yet implemented",
      currentValue: "Current Value",
      target: "Target",
      accountable: "Accountable",
      notes: "Notes",
      histogram: "Histogram",
      info: "Information",
      trajectory: "Performance Trajectory",
      last12: "(Last 12 Periods)",
      additionalContext: "Additional Context & Information",
      newStrategicEntry: "New Strategic Entry",
      operationalNote: "Operational Note",
      addNote: "Add Note",
      updateNote: "Update Note",
      addEntry: "Add Entry",
      updateContext: "Update Context",
      placeholderContext: "Add detailed business rules, logic explanation, or context...",
      placeholderNote: "Enter operational updates or strategic notes...",
      savedSuccessfully: "Saved Successfully",
      selectOrg: "Select Organizational Unit",
      allTypes: "All Unit Types",
      activeOnly: "Active Only",
      showingAll: "Showing All",
      auditLog: "Audit Log Trace"
    },
    NL: {
      dashboard: "Dashboard",
      configuration: "Configuratie",
      orgSelection: "Selecteer Organisatie-eenheid",
      searchPlaceholder: "Zoek eenheden of codes...",
      activeUnitsOnly: "Toon alleen actieve eenheden",
      initializing: "Cockpitsystemen initialiseren...",
      cockpitTitle: "pulsING COCKPIT DASHBOARD",
      configTitle: "Configuratiecentrum",
      language: "Taal",
      theme: "Thema",
      lightMode: "Lichte Modus",
      darkMode: "Donkere Modus",
      auditVault: "Audit Vault Lade",
      recentActivity: "Recente Activiteitsimpuls",
      noRecentActivity: "Geen recente configuratiewijzigingen geregistreerd voor deze unit.",
      root: "Wortel",
      levelUp: "Niveau Omhoog",
      back: "Terug",
      addOrg: "Organisatie Toevoegen",
      editOrg: "Organisatie Bewerken",
      deleteOrg: "Organisatie Verwijderen",
      save: "Wijzigingen Opslaan",
      cancel: "Annuleren",
      owner: "Eigenaar / Verantwoordelijke",
      type: "Type",
      teamCode: "Teamcode",
      description: "Beschrijving",
      title: "Titel",
      active: "Actief",
      disabled: "Uitgeschakeld",
      apiAdvice: "API ADVIES: nog niet geïmplementeerd",
      currentValue: "Huidige Waarde",
      target: "Doelstelling",
      accountable: "Verantwoordelijke",
      notes: "Notities",
      histogram: "Histogram",
      info: "Informatie",
      trajectory: "Prestatie Traject",
      last12: "(Laatste 12 Periodes)",
      additionalContext: "Extra Context & Informatie",
      newStrategicEntry: "Nieuwe Strategische Invoer",
      operationalNote: "Operationele Notitie",
      addNote: "Notitie Toevoegen",
      updateNote: "Notitie Bijwerken",
      addEntry: "Invoer Toevoegen",
      updateContext: "Context Bijwerken",
      placeholderContext: "Voeg gedetailleerde bedrijfsregels, logica-uitleg of context toe...",
      placeholderNote: "Voer operationele updates of strategische notities in...",
      savedSuccessfully: "Succesvol Opgeslagen",
      selectOrg: "Selecteer Organisatie-eenheid",
      allTypes: "Alle Eenheidstypes",
      activeOnly: "Alleen Actief",
      showingAll: "Alles Weergeven",
      auditLog: "Audit Logboek Rapport"
    },
    FR: {
      dashboard: "Tableau de Bord",
      configuration: "Configuration",
      orgSelection: "Sélectionner une Unité Organisationnelle",
      searchPlaceholder: "Rechercher des unités ou des codes...",
      activeUnitsOnly: "Afficher uniquement les unités actives",
      initializing: "Initialisation des Systèmes Cockpit...",
      cockpitTitle: "pulsING COCKPIT DASHBOARD",
      configTitle: "Moteur de Configuration",
      language: "Langue",
      theme: "Thème",
      lightMode: "Mode Clair",
      darkMode: "Mode Sombre",
      auditVault: "Tiroir du Coffre d'Audit",
      recentActivity: "Pulsation d'Activité Récente",
      noRecentActivity: "Aucune modification de configuration récente enregistrée pour cette unité.",
      root: "Racine",
      levelUp: "Niveau Supérieur",
      back: "Retour",
      addOrg: "Ajouter une Organisation",
      editOrg: "Modifier l'Organisation",
      deleteOrg: "Supprimer l'Organisation",
      save: "Enregistrer les modifications",
      cancel: "Annuler",
      owner: "Propriétaire / Responsable",
      type: "Type",
      teamCode: "Code d'Équipe",
      description: "Description",
      title: "Titre",
      active: "Actif",
      disabled: "Désactivé",
      apiAdvice: "CONSEIL API: pas encore implémenté",
      currentValue: "Valeur Actuelle",
      target: "Cible",
      accountable: "Responsable",
      notes: "Notes",
      histogram: "Histogramme",
      info: "Information",
      trajectory: "Trajectoire de Performance",
      last12: "(12 Dernières Périodes)",
      additionalContext: "Contexte et Informations Supplémentaires",
      newStrategicEntry: "Nouvelle Entrée Stratégique",
      operationalNote: "Note Opérationnelle",
      addNote: "Ajouter une Note",
      updateNote: "Mettre à jour la Note",
      addEntry: "Ajouter l'Entrée",
      updateContext: "Actualiser le Contexte",
      placeholderContext: "Ajoutez des règles métier détaillées, des explications logiques ou du contexte...",
      placeholderNote: "Saisissez les mises à jour opérationnelles ou les notes stratégiques...",
      savedSuccessfully: "Enregistré avec Succès",
      selectOrg: "Sélectionner une Unité Organisationnelle",
      allTypes: "Tous les types d'unités",
      activeOnly: "Actif uniquement",
      showingAll: "Afficher tout",
      auditLog: "Trace du journal d'audit"
    },
    ES: {
      dashboard: "Tablero",
      configuration: "Configuración",
      orgSelection: "Seleccionar unidad organizativa",
      searchPlaceholder: "Buscar unidades o códigos...",
      activeUnitsOnly: "Mostrar solo unidades activas",
      initializing: "Inicializando sistemas de cabina...",
      cockpitTitle: "pulsING TABLERO DE CABINA",
      configTitle: "Motor de configuración",
      language: "Idioma",
      theme: "Tema",
      lightMode: "Modo claro",
      darkMode: "Modo oscuro",
      auditVault: "Cajón de caja fuerte de auditoría",
      recentActivity: "Pulso de actividad reciente",
      noRecentActivity: "No se registraron cambios de configuración recientes para esta unidad.",
      root: "Raíz",
      levelUp: "Subir nivel",
      back: "Atrás",
      addOrg: "Agregar organización",
      editOrg: "Editar organización",
      deleteOrg: "Eliminar organización",
      save: "Guardar cambios",
      cancel: "Cancelar",
      owner: "Propietario / Responsable",
      type: "Tipo",
      teamCode: "Código de equipo",
      description: "Descripción",
      title: "Título",
      active: "Activo",
      disabled: "Desactivado",
      apiAdvice: "CONSEJO API: aún no implementado",
      currentValue: "Valor actual",
      target: "Objetivo",
      accountable: "Responsable",
      notes: "Notas",
      histogram: "Histograma",
      info: "Información",
      trajectory: "Trayectoria de rendimiento",
      last12: "(Últimos 12 períodos)",
      additionalContext: "Información y contexto adicional",
      newStrategicEntry: "Nueva entrada estratégica",
      operationalNote: "Nota operativa",
      addNote: "Agregar nota",
      updateNote: "Actualizar nota",
      addEntry: "Agregar entrada",
      updateContext: "Actualizar contexto",
      placeholderContext: "Agregue reglas de negocio detalladas, explicación lógica o contexto...",
      placeholderNote: "Ingrese actualizaciones operativas o notas estratégicas...",
      savedSuccessfully: "Guardado con éxito",
      selectOrg: "Seleccionar unidad organizativa",
      allTypes: "Todos los tipos de unidades",
      activeOnly: "Solo activos",
      showingAll: "Mostrando todos",
      auditLog: "Rastro del registro de auditoría"
    },
    DE: {
      dashboard: "Dashboard",
      configuration: "Konfiguration",
      orgSelection: "Organisationseinheit auswählen",
      searchPlaceholder: "Einheiten oder Codes suchen...",
      activeUnitsOnly: "Nur aktive Einheiten anzeigen",
      initializing: "Initialisierung der Cockpit-Systeme...",
      cockpitTitle: "pulsING COCKPIT DASHBOARD",
      configTitle: "Konfigurations-Engine",
      language: "Sprache",
      theme: "Design",
      lightMode: "Heller Modus",
      darkMode: "Dunkler Modus",
      auditVault: "Audit-Tresorschublade",
      recentActivity: "Aktueller Aktivitätspuls",
      noRecentActivity: "Für diese Einheit wurden keine aktuellen Konfigurationsänderungen aufgezeichnet.",
      root: "Stamm",
      levelUp: "Ebene höher",
      back: "Zurück",
      addOrg: "Organisation hinzufügen",
      editOrg: "Organisation bearbeiten",
      deleteOrg: "Organisation löschen",
      save: "Änderungen speichern",
      cancel: "Abbrechen",
      owner: "Eigentümer / Verantwortlicher",
      type: "Typ",
      teamCode: "Teamcode",
      description: "Beschreibung",
      title: "Titel",
      active: "Aktiv",
      disabled: "Deaktiviert",
      apiAdvice: "API-HINWEIS: noch nicht implementiert",
      currentValue: "Aktueller Wert",
      target: "Ziel",
      accountable: "Verantwortlich",
      notes: "Notizen",
      histogram: "Histogramm",
      info: "Informationen",
      trajectory: "Leistungsverlauf",
      last12: "(Letzte 12 Zeiträume)",
      additionalContext: "Zusätzlicher Kontext & Informationen",
      newStrategicEntry: "Neuer strategischer Eintrag",
      operationalNote: "Operationeller Hinweis",
      addNote: "Notiz hinzufügen",
      updateNote: "Notiz aktualisieren",
      addEntry: "Eintrag hinzufügen",
      updateContext: "Kontext aktualisieren",
      placeholderContext: "Detaillierte Geschäftsregeln, Logikerklärungen oder Kontext hinzufügen...",
      placeholderNote: "Operationelle Updates oder strategische Notizen eingeben...",
      savedSuccessfully: "Erfolgreich gespeichert",
      selectOrg: "Organisationseinheit auswählen",
      allTypes: "Alle Einheitstypen",
      activeOnly: "Nur Aktive",
      showingAll: "Alle anzeigen",
      auditLog: "Audit-Protokollverlauf"
    }
  };

  const t = translations[language];

  const [refreshIntervalSec, setRefreshIntervalSec] = useState(30);
  const [navigationStack, setNavigationStack] = useState<MetricHierarchy[][]>([]);
  const [configNavigationStack, setConfigNavigationStack] = useState<MetricHierarchy[][]>([]);
  const [selectedPath, setSelectedPath] = useState<MetricHierarchy[]>([]);
  const [configSelectedPath, setConfigSelectedPath] = useState<MetricHierarchy[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const formatDate = (date: Date | string | number) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: 'eca-be', title: 'EC&A BE', icon: 'Activity', description: 'Enterprise Content & Automation Belgium', isActive: true, type: 'IT Area', teamCode: 'T00001', owner: 'Mireille Van Damme' },
    { id: 'cdbe', title: 'C&D BE', icon: 'Globe', description: 'Customer & Data BE', isActive: true, type: 'Area', teamCode: 'T00002', owner: 'Filip Rombauts' },
    { id: 'sqwebb', title: 'Webb Squad', icon: 'Shield', description: 'EC&A Webb Squad', isActive: true, type: 'Squad', teamCode: 'T00003', owner: 'Hans Christiaens' },
    { id: 'eca-global', title: 'EC&A GLOBAL', icon: 'Layers', description: 'Global Consolidation Dashboard', isActive: true, type: 'Tribe', teamCode: 'T99999', owner: 'Global Team' }
  ]);

  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
  const [isAddMetricModalOpen, setIsAddMetricModalOpen] = useState(false);
  const [isEditMetricModalOpen, setIsEditMetricModalOpen] = useState(false);
  const [newMetricData, setNewMetricData] = useState<Partial<MetricHierarchy>>({
    title: '',
    description: '',
    unit: '%',
    value: 0,
    decimals: 2,
    enabled: true,
    thresholds: { red: 0.7, amber: 0.85 },
    dataSource: 'Manual',
    manualValue: 0,
    manualDenominator: 100
  });

  const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);
  const [menuOpenOrgId, setMenuOpenOrgId] = useState<string | null>(null);
  const [newOrgData, setNewOrgData] = useState<{ title: string, description: string, icon: string, type: 'Squad' | 'Area' | 'IT Area' | 'Tribe' | 'Community', teamCode: string, owner: string }>({
    title: '',
    description: '',
    icon: 'Activity',
    type: 'Squad',
    teamCode: '',
    owner: ''
  });
  const [editOrgData, setEditOrgData] = useState<{ title: string, description: string, icon: string, type: 'Squad' | 'Area' | 'IT Area' | 'Tribe' | 'Community', teamCode: string, owner: string }>({
    title: '',
    description: '',
    icon: 'Activity',
    type: 'Squad',
    teamCode: '',
    owner: ''
  });

  const [editingMetric, setEditingMetric] = useState<MetricHierarchy | null>(null);
  const [selectedDataSource, setSelectedDataSource] = useState<'Power BI' | 'Excel' | 'Database' | 'Manual'>('Database');
  const [orgTitle, setOrgTitle] = useState('EC&A BE');
  const [orgDescription, setOrgDescription] = useState('Belgium Operations & Regional Cockpit');
  const [orgIcon, setOrgIcon] = useState('Activity');
  const [orgTeamType, setOrgTeamType] = useState<'Squad' | 'Area' | 'IT Area' | 'Tribe' | 'Community'>('Area');
  const [orgTeamCode, setOrgTeamCode] = useState('T00001');
  const [orgOwner, setOrgOwner] = useState('Hans Christiaens');
  const [layerFilter, setLayerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [orgTypeFilter, setOrgTypeFilter] = useState<string>('all');
  const [showOnlyActiveOrgs, setShowOnlyActiveOrgs] = useState(true);

  const orgColors = ['#4D0020', '#89D6FD', '#FF6200', '#FFE100', '#D40199', '#7724FF'];
  const getContrastColor = (hex: string) => {
    // Basic brightness check: #4D0020, #FF6200, #D40199, #7724FF are dark/saturated (light text)
    // #89D6FD, #FFE100 are light (dark text)
    const darkColors = ['#4D0020', '#FF6200', '#D40199', '#7724FF'];
    return darkColors.includes(hex.toUpperCase()) ? 'text-white' : 'text-slate-900';
  };

  const handleOrgSelect = (org: Organization) => {
    if (!org.isActive) return;
    setCurrentOrgId(org.id);
    setOrgTitle(org.title);
    setOrgDescription(org.description);
    setOrgIcon(org.icon);
    setOrgTeamType(org.type || 'Squad');
    setOrgTeamCode(org.teamCode || '');
    setOrgOwner(org.owner || '');
    setActiveView('dashboard');
    // Clear navigation to ensure independence
    setNavigationStack([]);
    setConfigNavigationStack([]);
    setSelectedPath([]);
    setConfigSelectedPath([]);
    addLog('ORG_SWITCH', `Switched to organization: ${org.title}`);
  };

  const handleToggleOrgActive = (id: string) => {
    const org = organizations.find(o => o.id === id);
    if (!org) return;

    setOrganizations(prev => prev.map(o =>
        o.id === id ? { ...o, isActive: !o.isActive } : o
    ));

    addLog('ORG_TOGGLE', `Organization ${org.title} is now ${!org.isActive ? 'Active' : 'Deactivated'}`);
  };

  const handleAddOrg = () => {
    if (!newOrgData.title) return;
    const id = `org-${Date.now()}`;
    setOrganizations(prev => [...prev, {
      ...newOrgData,
      id,
      isActive: true,
      type: newOrgData.type,
      teamCode: newOrgData.teamCode || undefined
    }]);
    setIsAddOrgModalOpen(false);
    setNewOrgData({ title: '', description: '', icon: 'Activity', type: 'Squad', teamCode: '', owner: '' });
    addLog('ORG_CREATE', `Created new organization: ${newOrgData.title} (${newOrgData.type})${newOrgData.teamCode ? ' [' + newOrgData.teamCode + ']' : ''}`);
  };

  const handleEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setEditOrgData({
      title: org.title,
      description: org.description,
      icon: org.icon,
      type: org.type || ('Squad' as any),
      teamCode: org.teamCode || '',
      owner: org.owner || ''
    });
    setIsEditOrgModalOpen(true);
    setMenuOpenOrgId(null);
  };

  const handleUpdateOrg = () => {
    if (!editingOrg || !editOrgData.title) return;

    // Detect changes for detailed logging
    const changes: string[] = [];
    const fields: { key: keyof Organization; label: string }[] = [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
      { key: 'type', label: 'Unit Type' },
      { key: 'teamCode', label: 'Unit Code' },
      { key: 'owner', label: 'Owner' },
      { key: 'icon', label: 'Icon' }
    ];

    fields.forEach(({ key, label }) => {
      const oldValue = editingOrg[key];
      const newValue = editOrgData[key];
      if (oldValue !== newValue) {
        changes.push(`${label}: "${oldValue}" → "${newValue}"`);
      }
    });

    setOrganizations(prev => prev.map(o =>
        o.id === editingOrg.id ? { ...o, ...editOrgData } : o
    ));

    // If current org is being edited, update cockpit title/description
    if (currentOrgId === editingOrg.id) {
      setOrgTitle(editOrgData.title);
      setOrgDescription(editOrgData.description);
      setOrgIcon(editOrgData.icon);
      setOrgTeamType(editOrgData.type);
      setOrgTeamCode(editOrgData.teamCode);
      setOrgOwner(editOrgData.owner);
    }

    setIsEditOrgModalOpen(false);
    setEditingOrg(null);

    const detailMsg = changes.length > 0
        ? `Updated organization "${editingOrg.title}": ${changes.join(', ')}`
        : `Updated organization: ${editOrgData.title} (No changes detected)`;

    addLog('ORG_UPDATE', detailMsg);
  };

  const handleDeleteOrg = (id: string | null) => {
    if (!id) return;
    const org = organizations.find(o => o.id === id);
    setOrganizations(prev => prev.filter(org => org.id !== id));
    setOrgToDelete(null);
    addLog('ORG_DELETE', `ADMIN: Irreversibly removed organization "${org?.title || id}" from the system.`);
  };

  const availableIcons = {
    Activity,
    Shield,
    Zap,
    Target,
    Gauge,
    Globe,
    Layers,
    BarChart3
  };

  const OrgLogoIcon = availableIcons[orgIcon as keyof typeof availableIcons] || Activity;

  // Initialize navigation stacks
  useEffect(() => {
    if (hierarchy.length > 0) {
      if (navigationStack.length === 0) setNavigationStack([hierarchy]);
      if (configNavigationStack.length === 0) setConfigNavigationStack([hierarchy]);
    }
  }, [hierarchy, navigationStack.length, configNavigationStack.length]);

  // Sync UI state when metric is selected for editing
  useEffect(() => {
    if (editingMetric) {
      setSelectedDataSource(editingMetric.dataSource || 'Database');
    }
  }, [editingMetric]);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle auto-refresh
  useEffect(() => {
    if (refreshIntervalSec <= 0) return;
    const timer = setInterval(() => {
      refreshData();
    }, refreshIntervalSec * 1000);
    return () => clearInterval(timer);
  }, [refreshIntervalSec, refreshData]);

  const currentLayer = navigationStack[navigationStack.length - 1] || [];
  const selectedDetailMetric = useMemo(() => {
    if (!selectedDetailMetricId) return null;
    const findMetric = (list: MetricHierarchy[]): MetricHierarchy | null => {
      for (const m of list) {
        if (m.id === selectedDetailMetricId) return m;
        if (m.children) {
          const found = findMetric(m.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findMetric(hierarchy);
  }, [selectedDetailMetricId, hierarchy]);

  const currentConfigLayer = configNavigationStack[configNavigationStack.length - 1] || [];
  const currentLevel = navigationStack.length;
  const currentConfigLevel = configNavigationStack.length;

  const addLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      userId: 'h.christiaens@gmail.com',
      action,
      details,
      orgId: currentOrgId || undefined,
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => log.orgId === currentOrgId);
  }, [auditLogs, currentOrgId]);

  const formatMetricValue = (val: number, unit: string, decimals: number = 2) => {
    const formatted = val.toLocaleString('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return unit === '€' ? `€${formatted}` : `${val.toFixed(decimals)}${unit}`;
  };

  const handleDrillDown = async (metric: MetricHierarchy) => {
    // Always close detail view when interacting with other metrics or drilling
    setSelectedDetailMetricId(null);

    if (activeView === 'config') {
      setEditingMetric(metric);
      return;
    }

    if (metric.children && metric.children.length > 0) {
      setNavigationStack(prev => [...prev, metric.children!]);
      setSelectedPath(prev => [...prev, metric]);
    }
  };

  const handleBack = () => {
    setSelectedDetailMetricId(null);
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1));
      setSelectedPath(prev => prev.slice(0, -1));
    }
  };

  const handleJumpToMetric = (targetId: string) => {
    let found = false;
    const findPath = (currentList: MetricHierarchy[], currentPath: MetricHierarchy[], currentStack: MetricHierarchy[][]) => {
      for (const m of currentList) {
        if (m.id === targetId) {
          setSelectedPath(currentPath);
          setNavigationStack(currentStack);
          found = true;
          return true;
        }
        if (m.children && m.children.length > 0) {
          if (findPath(m.children, [...currentPath, m], [...currentStack, m.children])) return true;
        }
      }
      return false;
    };

    findPath(hierarchy, [], [hierarchy]);
    if (found) {
      setActiveView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfigDrillDown = (metric: MetricHierarchy) => {
    if (metric.children && metric.children.length > 0) {
      setConfigNavigationStack(prev => [...prev, metric.children!]);
      setConfigSelectedPath(prev => [...prev, metric]);
    }
  };

  const handleConfigBack = () => {
    if (configNavigationStack.length > 1) {
      setConfigNavigationStack(prev => prev.slice(0, -1));
      setConfigSelectedPath(prev => prev.slice(0, -1));
    }
  };

  const handleAddMetric = () => {
    if (!newMetricData.title || selectedPath.length < 2) return;

    // Accountable person mandatory for layer 1 and 2
    // Layer level is selectedPath.length (1-indexed)
    const layerLevel = selectedPath.length;
    if ((layerLevel === 1 || layerLevel === 2) && (!newMetricData.accountablePerson || newMetricData.accountablePerson.trim() === '')) {
      alert('Accountable Person is mandatory for Layer 1 and Layer 2 metrics.');
      return;
    }

    const parentId = selectedPath[selectedPath.length - 1].id;
    const newMetric: MetricHierarchy = {
      id: `m-${Date.now()}`,
      title: newMetricData.title,
      description: newMetricData.description || '',
      unit: newMetricData.unit || '%',
      value: newMetricData.value || 0,
      status: calculateStatus(newMetricData.value || 0, newMetricData.thresholds || { red: 0.7, amber: 0.85 }),
      target: 1,
      thresholds: newMetricData.thresholds || { red: 0.7, amber: 0.85 },
      decimals: newMetricData.decimals ?? 2,
      enabled: true,
      dataSource: newMetricData.dataSource as any || 'Manual',
      manualValue: newMetricData.manualValue,
      manualDenominator: newMetricData.manualDenominator,
      accountablePerson: newMetricData.accountablePerson,
      deadline: newMetricData.deadline,
      notes: [],
      history: [newMetricData.value || 0]
    };

    const addRecursive = (list: MetricHierarchy[]): MetricHierarchy[] => {
      return list.map(m => {
        if (m.id === parentId) {
          return {
            ...m,
            children: [...(m.children || []), newMetric]
          };
        } else if (m.children) {
          return {
            ...m,
            children: addRecursive(m.children)
          };
        }
        return m;
      });
    };

    const newHierarchy = addRecursive(hierarchy);
    setHierarchy(newHierarchy);

    // Sync current navigation stack to show the new metric immediately
    const lastNode = selectedPath[selectedPath.length - 1];
    const updatedParent = addRecursive([lastNode])[0];
    if (updatedParent && updatedParent.children) {
      setNavigationStack(prev => {
        const newStack = [...prev];
        newStack[newStack.length - 1] = updatedParent.children!;
        return newStack;
      });
    }

    addLog('METRIC_CREATE', `Created new metric: ${newMetric.title} under ${lastNode.title}`);
    setIsAddMetricModalOpen(false);
    setNewMetricData({
      title: '',
      description: '',
      unit: '%',
      value: 0,
      decimals: 2,
      enabled: true,
      thresholds: { red: 0.7, amber: 0.85 },
      dataSource: 'Manual',
      manualValue: 0,
      manualDenominator: 100
    });
  };

  const updateMetricConfig = (id: string, updates: Partial<MetricHierarchy>) => {
    // Find old metric for detailed logging
    const findMetricLocal = (list: MetricHierarchy[]): MetricHierarchy | null => {
      for (const m of list) {
        if (m.id === id) return m;
        if (m.children) {
          const found = findMetricLocal(m.children);
          if (found) return found;
        }
      }
      return null;
    };

    const oldMetric = findMetricLocal(hierarchy);
    if (oldMetric) {
      const changes: string[] = [];
      const fields: { key: keyof MetricHierarchy; label: string }[] = [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'unit', label: 'Unit' },
        { key: 'accountablePerson', label: 'Accountable' },
        { key: 'target', label: 'Target' },
        { key: 'enabled', label: 'Enabled' },
        { key: 'dataSource', label: 'Source' },
        { key: 'decimals', label: 'Decimals' }
      ];

      fields.forEach(({ key, label }) => {
        if (key in updates) {
          const oldValue = oldMetric[key];
          const newValue = updates[key];
          if (oldValue !== newValue) {
            // For large texts like description or info, truncate in logs if needed,
            // but the request asks for details.
            const oldStr = typeof oldValue === 'string' && oldValue.length > 30 ? oldValue.substring(0, 27) + '...' : String(oldValue);
            const newStr = typeof newValue === 'string' && newValue.length > 30 ? newValue.substring(0, 27) + '...' : String(newValue);
            changes.push(`${label}: "${oldStr}" → "${newStr}"`);
          }
        }
      });

      if (updates.notes && oldMetric.notes) {
        if (updates.notes.length > oldMetric.notes.length) {
          changes.push(`Notes: Added new note`);
        } else if (updates.notes.length === oldMetric.notes.length) {
          changes.push(`Notes: Updated existing note`);
        } else {
          changes.push(`Notes: Removed note`);
        }
      }

      if (updates.additionalInfo !== undefined && updates.additionalInfo !== oldMetric.additionalInfo) {
        changes.push(`Info Text: Modified`);
      }

      if (updates.thresholds && oldMetric.thresholds) {
        if (updates.thresholds.red !== oldMetric.thresholds.red) {
          changes.push(`Red Threshold: "${oldMetric.thresholds.red}" → "${updates.thresholds.red}"`);
        }
        if (updates.thresholds.amber !== oldMetric.thresholds.amber) {
          changes.push(`Amber Threshold: "${oldMetric.thresholds.amber}" → "${updates.thresholds.amber}"`);
        }
      }

      if (changes.length > 0) {
        addLog('CONFIG_UPDATE', `Modified ${oldMetric.title}: ${changes.join(', ')}`);
      }
    }

    const recalculateParent = (metric: MetricHierarchy): MetricHierarchy => {
      if (!metric.children || metric.children.length === 0) return metric;

      const enabledChildren = metric.children.filter(c => c.enabled);
      if (enabledChildren.length === 0) {
        return { ...metric, value: 0, status: calculateStatus(0, metric.thresholds) };
      }

      const avgValue = enabledChildren.reduce((sum, c) => sum + c.value, 0) / enabledChildren.length;
      return {
        ...metric,
        value: Number(avgValue.toFixed(metric.decimals ?? 2)),
        status: calculateStatus(avgValue, metric.thresholds)
      };
    };

    const updateRecursive = (list: MetricHierarchy[]): MetricHierarchy[] => {
      return list.map(m => {
        let updated = m;
        if (m.id === id) {
          updated = { ...m, ...updates };

          // Force value if manual data source is selected
          if (updated.dataSource === 'Manual' && updated.manualValue !== undefined) {
            if (updated.manualDenominator && updated.manualDenominator > 0) {
              updated.value = Number(((updated.manualValue / updated.manualDenominator) * 100).toFixed(updated.decimals ?? 2));
              updated.unit = '%';
            } else {
              updated.value = updated.manualValue;
            }
          }

          if ('thresholds' in updates || 'value' in updates || 'enabled' in updates || 'dataSource' in updates) {
            updated.status = calculateStatus(updated.value, updated.thresholds);
          }
        } else if (m.children) {
          const newChildren = updateRecursive(m.children);
          if (newChildren !== m.children) {
            updated = { ...m, children: newChildren };
            // If children changed, recalculate this parent
            updated = recalculateParent(updated);
          }
        }
        return updated;
      });
    };

    const newHierarchy = updateRecursive(hierarchy);
    setHierarchy(newHierarchy);

    // Sync navigation stacks to reflect changes immediately without resetting view
    const rebuildStackFromPath = (root: MetricHierarchy[], currentPath: MetricHierarchy[]) => {
      const newStack: MetricHierarchy[][] = [root];
      const newPath: MetricHierarchy[] = [];
      let currentLevel = root;

      for (const segment of currentPath) {
        const found = currentLevel.find(m => m.id === segment.id);
        if (found) {
          newPath.push(found);
          if (found.children) {
            newStack.push(found.children);
            currentLevel = found.children;
          }
        } else {
          break;
        }
      }
      return { stack: newStack, path: newPath };
    };

    const newConfigNav = rebuildStackFromPath(newHierarchy, configSelectedPath);
    const newMainNav = rebuildStackFromPath(newHierarchy, selectedPath);

    setConfigNavigationStack(newConfigNav.stack);
    setConfigSelectedPath(newConfigNav.path);
    setNavigationStack(newMainNav.stack);
    setSelectedPath(newMainNav.path);

    setEditingMetric(null);
  };

  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = org.title.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
          (org.teamCode && org.teamCode.toLowerCase().includes(orgSearchQuery.toLowerCase()));
      const matchesType = orgTypeFilter === 'all' || org.type === orgTypeFilter;
      const matchesActive = !showOnlyActiveOrgs || org.isActive;

      return matchesSearch && matchesType && matchesActive;
    });
  }, [organizations, orgSearchQuery, orgTypeFilter, showOnlyActiveOrgs]);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-400">
          <Activity className="w-12 h-12 animate-pulse mb-4 text-orange-500" />
          <p className="text-sm font-mono tracking-widest uppercase">{t.initializing}</p>
        </div>
    );
  }

  return (
      <div className={cn("flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300", theme)}>
        {/* Sidebar - only show when an organization is selected */}
        {activeView !== 'org-selection' && (
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 space-y-8 transition-colors">
              <div className="flex items-center space-x-2 px-2">
                <div className="w-8 h-8 bg-slate-900 dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                  <OrgLogoIcon className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">{orgTitle}</span>
              </div>

              <nav className="flex-1 space-y-1">
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeView === 'dashboard' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    )}
                >
                  <Home size={18} /> {t.dashboard}
                </button>
              </nav>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto space-y-4">
                <button
                    onClick={() => setActiveView('config')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeView === 'config' ? 'bg-slate-900 dark:bg-slate-50 dark:text-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    )}
                >
                  <Settings size={18} /> {t.configuration}
                </button>
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-white shadow-lg">HC</div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black text-slate-900 dark:text-white truncate leading-none mb-1">h.christiaens@gmail.com</span>
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">System Administrator</span>
                  </div>
                </div>
              </div>
            </aside>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 relative" onClick={() => setSelectedDetailMetricId(null)}>
            <div className="max-w-6xl mx-auto" onClick={(e) => e.stopPropagation()}>

              {/* View Switching Logic */}
              <AnimatePresence mode="wait">
                {/* Add Organization Modal */}
                {isAddOrgModalOpen && (
                    <div key="add-org-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          onClick={() => setIsAddOrgModalOpen(false)}
                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                      />
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Add Organization</h2>
                              <p className="text-xs text-slate-500 mt-0.5 italic">Define a new organizational unit.</p>
                            </div>
                            <button onClick={() => setIsAddOrgModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                              <X size={18} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Organization Title</label>
                              <input
                                  type="text"
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                  placeholder="e.g. EC&A US"
                                  value={newOrgData.title}
                                  onChange={(e) => setNewOrgData({...newOrgData, title: e.target.value})}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Owner / Accountable</label>
                              <input
                                  type="text"
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                  placeholder="e.g. Hans Christiaens"
                                  value={newOrgData.owner}
                                  onChange={(e) => setNewOrgData({...newOrgData, owner: e.target.value})}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex justify-between">
                                Description
                                <span className="text-[9px] font-medium lowercase opacity-50">{newOrgData.description.length}/90</span>
                              </label>
                              <textarea
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all min-h-[80px] resize-none text-sm"
                                  placeholder="Brief purpose of this unit"
                                  maxLength={90}
                                  value={newOrgData.description}
                                  onChange={(e) => setNewOrgData({...newOrgData, description: e.target.value})}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Type</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none appearance-none text-sm"
                                    value={newOrgData.type}
                                    onChange={(e) => setNewOrgData({...newOrgData, type: e.target.value as any})}
                                >
                                  {['Squad', 'Area', 'IT Area', 'Tribe', 'Community'].map(t => (
                                      <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Team Code</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                    placeholder="T00000"
                                    maxLength={6}
                                    value={newOrgData.teamCode}
                                    onChange={(e) => {
                                      const val = e.target.value.toUpperCase().slice(0, 6);
                                      if (val === '' || /^T\d{0,5}$/.test(val)) {
                                        setNewOrgData({...newOrgData, teamCode: val});
                                      }
                                    }}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Select Icon</label>
                              <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl">
                                {Object.entries(availableIcons).map(([name, icon]) => {
                                  const IconComp = icon;
                                  return (
                                      <button
                                          key={name}
                                          onClick={() => setNewOrgData({...newOrgData, icon: name})}
                                          className={cn(
                                              "w-12 h-12 flex items-center justify-center rounded-xl transition-all border shadow-sm",
                                              newOrgData.icon === name
                                                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-white scale-110"
                                                  : "bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                                          )}
                                      >
                                        <IconComp size={20} />
                                      </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="mt-10 flex gap-3">
                            <button
                                onClick={() => setIsAddOrgModalOpen(false)}
                                className="flex-1 py-4 px-6 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                                disabled={!newOrgData.title}
                                onClick={handleAddOrg}
                                className="flex-1 py-4 px-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-white transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0"
                            >
                              Create Organization
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                )}

                {/* Edit Metric Modal */}
                <AnimatePresence>
                  {isEditMetricModalOpen && editingMetric && (
                      <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditMetricModalOpen(false)}
                            className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
                        >
                          <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Metric Configuration</h4>
                            </div>
                            <button onClick={() => setIsEditMetricModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors">
                              <X size={20} />
                            </button>
                          </div>

                          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <form className="space-y-6" onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              const accountable = formData.get('accountablePerson') as string;
                              const layerLevel = selectedPath.length + 1; // current dashboard layer
                              const isMandatory = layerLevel === 1 || layerLevel === 2;

                              if (isMandatory && (!accountable || accountable.trim() === '')) {
                                alert('Accountable Person is mandatory for Layer 1 and Layer 2 metrics.');
                                return;
                              }

                              updateMetricConfig(editingMetric.id, {
                                title: formData.get('title') as string,
                                description: formData.get('description') as string,
                                unit: formData.get('unit') as string,
                                additionalInfo: formData.get('additionalInfo') as string,
                                accountablePerson: accountable,
                                deadline: formData.get('deadline') as string,
                                enabled: formData.get('enabled') === 'on',
                                decimals: Number(formData.get('decimals')),
                                dataSource: formData.get('dataSource') as any,
                                manualDenominator: formData.get('manualDenominator') ? Number(formData.get('manualDenominator')) : 100,
                                target: formData.get('target') ? Number(formData.get('target')) : editingMetric.target,
                                lastUpdated: Date.now(),
                                thresholds: {
                                  red: Number(formData.get('red')),
                                  amber: Number(formData.get('amber'))
                                }
                              });
                              setIsEditMetricModalOpen(false);
                            }}>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <div className={cn("h-2 w-2 rounded-full", editingMetric.enabled ? "bg-emerald-500 shadow-sm" : "bg-slate-300")} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">Metric Status</span>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="enabled" defaultChecked={editingMetric.enabled} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                                  </label>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Title</label>
                                  <input name="title" defaultValue={editingMetric.title} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none" required />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                                  <textarea name="description" defaultValue={editingMetric.description} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium leading-relaxed focus:ring-2 focus:ring-slate-900 outline-none resize-none" placeholder="Brief context for this metric..." />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center justify-between">
                                    Accountable Person
                                    {(selectedPath.length === 0 || selectedPath.length === 1) && (
                                        <span className="text-[9px] text-rose-500 font-black lowercase tracking-tighter">mandatory</span>
                                    )}
                                  </label>
                                  <input
                                      name="accountablePerson"
                                      defaultValue={editingMetric.accountablePerson}
                                      className={cn(
                                          "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none",
                                          (selectedPath.length === 0 || selectedPath.length === 1) ? "border-slate-300" : "border-slate-200"
                                      )}
                                      placeholder="e.g. John Doe"
                                  />
                                </div>

                                {/* Target Value - Only for Layer 1 and 2 */}
                                {(selectedPath.length === 0 || selectedPath.length === 1) && (
                                    <div className="space-y-1.5 pt-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase px-1">Target Value</label>
                                      <input
                                          type="number"
                                          name="target"
                                          step="any"
                                          defaultValue={editingMetric.target || 1}
                                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                                      />
                                    </div>
                                )}

                                {/* Source / Logic - Only for Layer 3 */}
                                {selectedPath.length >= 2 && (
                                    <div className="space-y-4 pt-2 border-t border-slate-100">
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase px-1">Data Source</label>
                                        <select
                                            name="dataSource"
                                            defaultValue={editingMetric.dataSource || 'Manual'}
                                            onChange={(e) => setSelectedDataSource(e.target.value as any)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                                        >
                                          <option value="Excel">Microsoft Excel</option>
                                          <option value="Power BI">Power BI API</option>
                                          <option value="Database">SQL Connection</option>
                                          <option value="Manual">Manual Metric</option>
                                        </select>
                                      </div>

                                      {selectedDataSource === 'Manual' && (
                                          <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-blue-500 uppercase px-1">Denominator (Optional)</label>
                                            <input
                                                type="number"
                                                name="manualDenominator"
                                                step="any"
                                                defaultValue={editingMetric.manualDenominator || 100}
                                                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                                                placeholder="e.g. 100"
                                            />
                                          </div>
                                      )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase px-1">Unit</label>
                                    <select name="unit" defaultValue={editingMetric.unit} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none appearance-none">
                                      <option value="%">% Percentage</option>
                                      <option value="€">€ Euro</option>
                                      <option value="">None</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase px-1">Decimals</label>
                                    <input type="number" name="decimals" defaultValue={editingMetric.decimals ?? 2} min={0} max={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-rose-500 uppercase px-1">Red &lt;</label>
                                    <input type="number" name="red" step="0.01" defaultValue={editingMetric.thresholds.red} className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-xl text-sm font-black text-rose-600 focus:ring-2 focus:ring-rose-500 outline-none" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-amber-500 uppercase px-1">Amber &lt;</label>
                                    <input type="number" name="amber" step="0.01" defaultValue={editingMetric.thresholds.amber} className="w-full px-4 py-3 bg-amber-50/30 border border-amber-100 rounded-xl text-sm font-black text-amber-600 focus:ring-2 focus:ring-amber-500 outline-none" />
                                  </div>
                                </div>
                              </div>

                              <button type="submit" className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1 active:translate-y-0">
                                Apply Changes
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      </>
                  )}
                </AnimatePresence>

                {/* Add Metric Modal */}
                {isAddMetricModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          onClick={() => setIsAddMetricModalOpen(false)}
                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                      />
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
                      >
                        <div className="p-8 overflow-y-auto">
                          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                <PlusCircle className="text-blue-500" size={28} />
                                Add Layer 3 Metric
                              </h2>
                              <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Parent: {selectedPath[selectedPath.length - 1]?.title}</p>
                            </div>
                            <button onClick={() => setIsAddMetricModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                              <X size={20} />
                            </button>
                          </div>

                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Metric Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                    placeholder="e.g. Server Response Time"
                                    value={newMetricData.title}
                                    onChange={(e) => setNewMetricData({...newMetricData, title: e.target.value})}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Target Accountable</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                    placeholder="e.g. Jane Smith"
                                    value={newMetricData.accountablePerson}
                                    onChange={(e) => setNewMetricData({...newMetricData, accountablePerson: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Description</label>
                              <textarea
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all min-h-[80px] resize-none text-sm"
                                  placeholder="Describe what this metric measures and why it matters..."
                                  value={newMetricData.description}
                                  onChange={(e) => setNewMetricData({...newMetricData, description: e.target.value})}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Unit</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none appearance-none text-sm"
                                    value={newMetricData.unit}
                                    onChange={(e) => setNewMetricData({...newMetricData, unit: e.target.value})}
                                >
                                  <option value="%">% (Percentage)</option>
                                  <option value="€">€ (Euro)</option>
                                  <option value="ms">ms (Milliseconds)</option>
                                  <option value="">None</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Decimals</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                    placeholder="2"
                                    value={newMetricData.decimals}
                                    onChange={(e) => setNewMetricData({...newMetricData, decimals: parseInt(e.target.value)})}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-rose-400 px-1">Deadline Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                    value={newMetricData.deadline}
                                    onChange={(e) => setNewMetricData({...newMetricData, deadline: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Threshold Configuration</label>
                                <span className="text-[9px] font-bold text-blue-500 uppercase italic">Lower is better applies if red &gt; amber</span>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-rose-500 px-1">RED THRESHOLD (CRITICAL)</label>
                                  <input
                                      type="number"
                                      step="0.01"
                                      className="w-full bg-rose-50/50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 rounded-xl px-4 py-2.5 text-rose-900 dark:text-rose-100 font-black focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm"
                                      value={newMetricData.thresholds?.red}
                                      onChange={(e) => setNewMetricData({
                                        ...newMetricData,
                                        thresholds: { ...newMetricData.thresholds!, red: parseFloat(e.target.value) }
                                      })}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-amber-500 px-1">AMBER THRESHOLD (WARNING)</label>
                                  <input
                                      type="number"
                                      step="0.01"
                                      className="w-full bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl px-4 py-2.5 text-amber-900 dark:text-amber-100 font-black focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                                      value={newMetricData.thresholds?.amber}
                                      onChange={(e) => setNewMetricData({
                                        ...newMetricData,
                                        thresholds: { ...newMetricData.thresholds!, amber: parseFloat(e.target.value) }
                                      })}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Initial Data Integration</label>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 px-1">INITIAL VALUE</label>
                                  <input
                                      type="number"
                                      step="0.01"
                                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                      value={newMetricData.manualValue}
                                      onChange={(e) => setNewMetricData({
                                        ...newMetricData,
                                        manualValue: parseFloat(e.target.value),
                                        value: newMetricData.manualDenominator ? (parseFloat(e.target.value) / newMetricData.manualDenominator) * 100 : parseFloat(e.target.value)
                                      })}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 px-1">DENOMINATOR / TARGET</label>
                                  <input
                                      type="number"
                                      step="0.01"
                                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                      value={newMetricData.manualDenominator}
                                      onChange={(e) => setNewMetricData({
                                        ...newMetricData,
                                        manualDenominator: parseFloat(e.target.value),
                                        value: parseFloat(e.target.value) > 0 ? (newMetricData.manualValue! / parseFloat(e.target.value)) * 100 : newMetricData.manualValue
                                      })}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-12 flex gap-4">
                            <button
                                onClick={() => setIsAddMetricModalOpen(false)}
                                className="flex-1 py-4 px-6 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                                disabled={!newMetricData.title}
                                onClick={handleAddMetric}
                                className="flex-1 py-4 px-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-sm font-bold shadow-2xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-white transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0"
                            >
                              Create Metric
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                )}

                {/* Edit Organization Modal */}
                {isEditOrgModalOpen && (
                    <div key="edit-org-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          onClick={() => { setIsEditOrgModalOpen(false); setEditingOrg(null); }}
                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                      />
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Organization</h2>
                              <p className="text-xs text-slate-500 mt-0.5 italic">Update details for {editingOrg?.title}.</p>
                            </div>
                            <button onClick={() => { setIsEditOrgModalOpen(false); setEditingOrg(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                              <X size={18} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Organization Title</label>
                              <input
                                  type="text"
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                  placeholder="e.g. EC&A US"
                                  value={editOrgData.title}
                                  onChange={(e) => setEditOrgData({...editOrgData, title: e.target.value})}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Owner / Accountable</label>
                              <input
                                  type="text"
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                  placeholder="e.g. Hans Christiaens"
                                  value={editOrgData.owner}
                                  onChange={(e) => setEditOrgData({...editOrgData, owner: e.target.value})}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex justify-between">
                                Description
                                <span className="text-[9px] font-medium lowercase opacity-50">{editOrgData.description.length}/90</span>
                              </label>
                              <textarea
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all min-h-[80px] resize-none text-sm"
                                  placeholder="Brief purpose of this unit"
                                  maxLength={90}
                                  value={editOrgData.description}
                                  onChange={(e) => setEditOrgData({...editOrgData, description: e.target.value})}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Type</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none appearance-none text-sm"
                                    value={editOrgData.type}
                                    onChange={(e) => setEditOrgData({...editOrgData, type: e.target.value as any})}
                                >
                                  {['Squad', 'Area', 'IT Area', 'Tribe', 'Community'].map(t => (
                                      <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Team Code</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 outline-none transition-all text-sm"
                                    placeholder="T00000"
                                    maxLength={6}
                                    value={editOrgData.teamCode}
                                    onChange={(e) => {
                                      const val = e.target.value.toUpperCase().slice(0, 6);
                                      if (val === '' || /^T\d{0,5}$/.test(val)) {
                                        setEditOrgData({...editOrgData, teamCode: val});
                                      }
                                    }}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Select Icon</label>
                              <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl">
                                {Object.entries(availableIcons).map(([name, icon]) => {
                                  const IconComp = icon;
                                  return (
                                      <button
                                          key={name}
                                          onClick={() => setEditOrgData({...editOrgData, icon: name})}
                                          className={cn(
                                              "w-12 h-12 flex items-center justify-center rounded-xl transition-all border shadow-sm",
                                              editOrgData.icon === name
                                                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-white scale-110"
                                                  : "bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                                          )}
                                      >
                                        <IconComp size={20} />
                                      </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="mt-10 flex gap-3">
                            <button
                                onClick={() => { setIsEditOrgModalOpen(false); setEditingOrg(null); }}
                                className="flex-1 py-4 px-6 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                                disabled={!editOrgData.title}
                                onClick={handleUpdateOrg}
                                className="flex-1 py-4 px-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-white transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {orgToDelete && (
                    <div key="delete-org-modal" className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                      <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          onClick={() => setOrgToDelete(null)}
                          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                      />
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-8 border-2 border-rose-50 dark:border-rose-900/30"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mb-6 animate-bounce">
                            <AlertTriangle size={40} />
                          </div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Irreversible Action</h2>
                          <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                            You are about to permanently delete <span className="font-bold text-slate-900 dark:text-white">"{organizations.find(o => o.id === orgToDelete)?.title}"</span>.
                            This will remove all associated dashboards, metrics, and history immediately.
                          </p>

                          <div className="mt-8 flex flex-col w-full gap-2">
                            <button
                                onClick={() => handleDeleteOrg(orgToDelete)}
                                className="w-full py-4 bg-rose-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
                            >
                              Yes, Delete Forever
                            </button>
                            <button
                                onClick={() => setOrgToDelete(null)}
                                className="w-full py-4 text-slate-400 dark:text-slate-500 text-sm font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              Cancel and Go Back
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                )}

                {activeView === 'org-selection' && (
                    <motion.div
                        key="org-selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center justify-center min-h-[60vh]"
                    >
                      <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 group transition-transform hover:scale-105">
                          <LayoutGrid className="text-white w-10 h-10" />
                        </div>
                        <div className="flex flex-col items-center gap-1 mb-3">
                          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">pulsING <span className="text-slate-400 dark:text-slate-500 font-medium">gateway</span></h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto italic text-sm">{t.selectOrg}</p>
                      </div>

                      <div className="w-full max-w-7xl px-4 mb-8 flex flex-wrap gap-4 items-center justify-center">
                        {/* Search */}
                        <div className="relative group flex-1 min-w-[200px]">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={16} />
                          <input
                              type="text"
                              placeholder={t.searchPlaceholder}
                              value={orgSearchQuery}
                              onChange={(e) => setOrgSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-700 outline-none transition-all shadow-sm dark:text-white"
                          />
                        </div>

                        {/* Type Filter */}
                        <div className="relative min-w-[150px]">
                          <select
                              value={orgTypeFilter}
                              onChange={(e) => setOrgTypeFilter(e.target.value)}
                              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-700 outline-none appearance-none cursor-pointer shadow-sm pr-10 font-medium dark:text-white"
                          >
                            <option value="all">{t.allTypes}</option>
                            {['Squad', 'Area', 'IT Area', 'Tribe', 'Community'].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>

                        {/* Active Toggle */}
                        <button
                            onClick={() => setShowOnlyActiveOrgs(!showOnlyActiveOrgs)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border",
                                showOnlyActiveOrgs
                                    ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-800 dark:border-slate-700 shadow-lg"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                            )}
                        >
                          {showOnlyActiveOrgs ? t.activeOnly : t.showingAll}
                          <div className={cn(
                              "w-2 h-2 rounded-full",
                              showOnlyActiveOrgs ? "bg-emerald-400 animate-pulse" : "bg-slate-300 dark:bg-slate-600"
                          )} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-7xl px-4">
                        {filteredOrganizations.map((org, index) => {
                          const Icon = availableIcons[org.icon as keyof typeof availableIcons] || Building;
                          const baseBgColor = orgColors[index % orgColors.length];
                          const bgColor = org.isActive ? baseBgColor : '#E2E8F0'; // Group-slate-200 equivalent
                          const textColor = org.isActive ? getContrastColor(bgColor) : 'text-slate-500';
                          const isDark = org.isActive && textColor === 'text-white';

                          return (
                              <div
                                  key={org.id}
                                  className={cn(
                                      "group relative rounded-3xl p-4 text-left transition-all focus-within:ring-2 focus-within:ring-slate-900 shadow-md border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm",
                                      org.isActive ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : "cursor-default opacity-80",
                                      menuOpenOrgId === org.id ? "z-30" : "z-0"
                                  )}
                                  onClick={() => org.isActive && handleOrgSelect(org)}
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                                    <div
                                        className={cn(
                                            "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border border-black/5 dark:border-white/5",
                                            !org.isActive && "grayscale opacity-50"
                                        )}
                                        style={{ backgroundColor: bgColor, color: getContrastColor(bgColor) === 'text-white' ? 'white' : '#0f172a' }}
                                    >
                                      <Icon size={22} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center leading-tight">{org.type}</span>
                                    {org.teamCode && (
                                        <span className="text-[10px] font-mono font-black tracking-tighter text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-inner">{org.teamCode}</span>
                                    )}
                                    {!org.isActive && (
                                        <span className="text-[7px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded leading-none mt-1">
                                  Off
                                </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1.5">
                                      <div className="flex flex-col min-w-0">
                                        <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white truncate leading-tight">{org.title}</h3>
                                        {org.owner && (
                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 italic truncate opacity-70">
                                      {org.owner}
                                    </span>
                                        )}
                                      </div>

                                      <div className="relative">
                                        <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setMenuOpenOrgId(menuOpenOrgId === org.id ? null : org.id);
                                            }}
                                            className="p-1.5 rounded-lg transition-all border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800"
                                        >
                                          <MoreVertical size={16} />
                                        </button>

                                        <AnimatePresence>
                                          {menuOpenOrgId === org.id && (
                                              <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={(e) => { e.stopPropagation(); setMenuOpenOrgId(null); }}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                  <div className="p-2 space-y-1 text-slate-900">
                                                    <button
                                                        onClick={() => {
                                                          handleToggleOrgActive(org.id);
                                                          setMenuOpenOrgId(null);
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all",
                                                            org.isActive ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                                                        )}
                                                    >
                                                      {org.isActive ? (
                                                          <>
                                                            <Power size={14} className="shrink-0" />
                                                            <span>Disable</span>
                                                          </>
                                                      ) : (
                                                          <>
                                                            <Zap size={14} className="shrink-0" />
                                                            <span>Enable</span>
                                                          </>
                                                      )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditOrg(org)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all text-left"
                                                    >
                                                      <Edit2 size={14} className="shrink-0" />
                                                      <span>Edit Details</span>
                                                    </button>
                                                    <div className="h-px bg-slate-50 mx-2" />
                                                    <button
                                                        onClick={() => {
                                                          setOrgToDelete(org.id);
                                                          setMenuOpenOrgId(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
                                                    >
                                                      <Trash2 size={14} className="shrink-0" />
                                                      <span>Remove</span>
                                                    </button>
                                                  </div>
                                                </motion.div>
                                              </>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    </div>

                                    <p
                                        title={org.description}
                                        className="text-[11px] leading-snug font-medium text-slate-600 line-clamp-3 w-full"
                                    >
                                      {org.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                          );
                        })}

                        {/* Add Organization Button */}
                        <button
                            onClick={() => setIsAddOrgModalOpen(true)}
                            className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-4 transition-all hover:border-slate-400 hover:bg-slate-50/50 min-h-[120px]"
                        >
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 mb-2">
                            <Plus size={20} />
                          </div>
                          <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors text-center px-4">Add New Organization</span>
                        </button>
                      </div>
                    </motion.div>
                )}

                {activeView === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex items-center gap-6 mb-8 border-b border-slate-200 pb-6">
                        {navigationStack.length > 1 ? (
                            <button
                                onClick={handleBack}
                                className="group flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back
                            </button>
                        ) : (
                            <button
                                onClick={() => { setActiveView('org-selection'); setNavigationStack([]); setSelectedPath([]); }}
                                className="p-2.5 bg-white border border-slate-200 hover:border-slate-900 hover:text-slate-900 rounded-xl text-slate-400 transition-all shadow-sm"
                                title="Return to Gateway"
                            >
                              <LayoutGrid size={20} />
                            </button>
                        )}

                        <div className="flex-1 min-w-0">
                          <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            {selectedPath.length > 0 ? (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <button
                                      onClick={() => {
                                        setSelectedDetailMetricId(null);
                                        setNavigationStack([hierarchy]);
                                        setSelectedPath([]);
                                      }}
                                      className="hover:text-blue-600 transition-colors uppercase tracking-tight"
                                  >
                                    {t.dashboard}
                                  </button>
                                  <span className="text-slate-300">/</span>
                                  {selectedPath.map((node, idx) => (
                                      <React.Fragment key={`${node.id}-breadcrumb-${idx}`}>
                                        <button
                                            onClick={() => {
                                              if (idx < selectedPath.length - 1) {
                                                setSelectedDetailMetricId(null);
                                                setNavigationStack(navigationStack.slice(0, idx + 2));
                                                setSelectedPath(selectedPath.slice(0, idx + 1));
                                              }
                                            }}
                                            disabled={idx === selectedPath.length - 1}
                                            className={cn(
                                                "transition-colors uppercase tracking-tight",
                                                idx === selectedPath.length - 1 ? "cursor-default text-slate-900" : "hover:text-blue-600 text-slate-500"
                                            )}
                                        >
                                          {node.title}
                                        </button>
                                        {idx < selectedPath.length - 1 && <span className="text-slate-300">/</span>}
                                      </React.Fragment>
                                  ))}
                                  <span className="ml-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] rounded-md uppercase tracking-widest font-black">L{currentLevel}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-300 dark:text-slate-600 font-medium lowercase">pulsING</span>
                                  <span className="uppercase tracking-tighter dark:text-white">Cockpit Dashboard</span>
                                </div>
                            )}
                          </h1>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedDetailMetric && (
                            <div className="mb-8">
                              <MetricDetailHeader
                                  metric={selectedDetailMetric}
                                  onClose={() => setSelectedDetailMetricId(null)}
                                  onUpdateMetric={updateMetricConfig}
                                  addLog={addLog}
                                  t={t}
                              />
                            </div>
                        )}
                      </AnimatePresence>

                      <div className={cn(
                          "grid gap-4",
                          currentLevel === 3
                              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      )}>
                        {currentLayer.filter(m => m.enabled !== false).map((metric) => (
                            <MetricCard
                                key={metric.id}
                                title={metric.title}
                                value={formatMetricValue(metric.value, metric.unit, metric.decimals)}
                                status={metric.status}
                                description={metric.description}
                                additionalInfo={metric.additionalInfo}
                                accountablePerson={metric.accountablePerson}
                                deadline={currentLevel === 3 ? metric.deadline : undefined}
                                onClick={() => handleDrillDown(metric)}
                                thresholds={metric.thresholds}
                                enabled={metric.enabled}
                                trend={metric.trend}
                                history={metric.history}
                                unit={metric.unit}
                                notes={metric.notes}
                                lastUpdated={metric.lastUpdated}
                                onSelectDetail={() => setSelectedDetailMetricId(metric.id)}
                                onEdit={() => { setEditingMetric(metric); setIsEditMetricModalOpen(true); }}
                                adviceText={t.apiAdvice}
                            />
                        ))}

                        {/* Add Metric Button - Only on Layer 3 */}
                        {currentLevel === 3 && (
                            <button
                                onClick={() => setIsAddMetricModalOpen(true)}
                                className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 transition-all hover:border-slate-400 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 min-h-[200px]"
                            >
                              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 mb-3 group-hover:scale-110">
                                <Plus size={24} />
                              </div>
                              <h3 className="text-sm font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Add Metric</h3>
                              <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Define new performance indicator</p>
                            </button>
                        )}
                      </div>
                    </motion.div>
                )}

                {activeView === 'config' && (
                    <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex items-center gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                        <div className="flex-1 min-w-0">
                          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t.configuration}</h1>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">App Settings & Personalization</p>
                        </div>
                      </div>

                      <div className="max-w-2xl space-y-8">
                        {/* Theme Selection */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                              {theme === 'light' ? <Zap size={18} /> : <Zap size={18} fill="currentColor" />}
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{t.theme}</h3>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => {
                                  const oldTheme = theme;
                                  setTheme('light');
                                  if (oldTheme !== 'light') {
                                    addLog('CONFIG_UPDATE', `Theme: "${oldTheme}" → "light"`);
                                  }
                                }}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-6 rounded-xl border transition-all",
                                    theme === 'light'
                                        ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                                )}
                            >
                              <div className={cn("p-2 rounded-full", theme === 'light' ? "bg-white/10" : "bg-white dark:bg-slate-700 shadow-sm")}>
                                <Zap size={24} className={theme === 'light' ? "text-white" : "text-yellow-500"} />
                              </div>
                              <span className="text-xs font-black uppercase tracking-widest">{t.lightMode}</span>
                            </button>

                            <button
                                onClick={() => {
                                  const oldTheme = theme;
                                  setTheme('dark');
                                  if (oldTheme !== 'dark') {
                                    addLog('CONFIG_UPDATE', `Theme: "${oldTheme}" → "dark"`);
                                  }
                                }}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-6 rounded-xl border transition-all",
                                    theme === 'dark'
                                        ? "bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-slate-900/10"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                                )}
                            >
                              <div className={cn("p-2 rounded-full", theme === 'dark' ? "bg-white/10" : "bg-white dark:bg-slate-700 shadow-sm")}>
                                <Zap size={24} fill="currentColor" className={theme === 'dark' ? "text-white" : "text-slate-400"} />
                              </div>
                              <span className="text-xs font-black uppercase tracking-widest">{t.darkMode}</span>
                            </button>
                          </div>
                        </div>

                        {/* Language Selection */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center text-slate-600 dark:text-slate-400">
                              <Globe size={18} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{t.language}</h3>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                              { code: 'EN', label: 'English', sub: 'Default' },
                              { code: 'NL', label: 'Nederlands', sub: 'Dutch' },
                              { code: 'FR', label: 'Français', sub: 'French' },
                              { code: 'ES', label: 'Español', sub: 'Spanish' },
                              { code: 'DE', label: 'Deutsch', sub: 'German' }
                            ].map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                      const oldLang = language;
                                      const newLang = lang.code as any;
                                      setLanguage(newLang);
                                      if (oldLang !== newLang) {
                                        addLog('CONFIG_UPDATE', `Language: "${oldLang}" → "${newLang}"`);
                                      }
                                    }}
                                    className={cn(
                                        "flex flex-col p-4 rounded-xl border transition-all text-left",
                                        language === lang.code
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                                    )}
                                >
                                  <span className="text-sm font-bold">{lang.label}</span>
                                  <span className={cn("text-[10px] uppercase font-black tracking-tighter opacity-50")}>
                               {lang.code} • {lang.sub}
                            </span>
                                </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Minimized Log Preview */}
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 mt-auto shrink-0 transition-colors">
            <div className="max-w-6xl mx-auto flex justify-between items-stretch">
              <div className="flex items-center gap-6 flex-1 overflow-hidden mr-8">
                <div className="space-y-1.5 flex-1 overflow-hidden">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Recent Activity Pulse
                  </h4>
                  <div className="h-5 relative">
                    <AnimatePresence mode="wait">
                      {filteredLogs.filter(l => l.action === 'CONFIG_UPDATE').length > 0 ? (
                          <motion.p
                              key={filteredLogs.filter(l => l.action === 'CONFIG_UPDATE')[0].id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-xs text-slate-600 dark:text-slate-400 truncate"
                          >
                            <span className="font-bold text-slate-400 dark:text-slate-500 mr-2">[{new Date(filteredLogs.filter(l => l.action === 'CONFIG_UPDATE')[0].timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            <span className="font-bold text-slate-900 dark:text-white">[{filteredLogs.filter(l => l.action === 'CONFIG_UPDATE')[0].action}]</span> {filteredLogs.filter(l => l.action === 'CONFIG_UPDATE')[0].details}
                          </motion.p>
                      ) : (
                          <p key="no-recent-config" className="text-xs text-slate-400 italic">No recent configuration changes recorded for this unit.</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end justify-center">
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  pulsING gateway
                </div>
                <button
                    onClick={() => setShowLogs(!showLogs)}
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline flex items-center gap-1 uppercase tracking-widest transition-colors"
                >
                  <History size={14} />
                  AUDIT TRACE
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Audit Vault Drawer */}
        <AnimatePresence>
          {showLogs && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogs(false)} className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-[2px]" />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 bg-slate-900 dark:bg-slate-800 rounded flex items-center justify-center"><History size={10} className="text-white" /></div>
                      <h2 className="text-xl font-bold tracking-tight dark:text-white">{t.auditLog}</h2>
                    </div>
                    <button onClick={() => setShowLogs(false)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">&times;</button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-6">
                    {filteredLogs.map((log, idx) => (
                        <div key={`${log.id}-${idx}`} className="relative pl-6 border-l border-slate-100 dark:border-slate-800">
                          <div className="absolute -left-[3.5px] top-0 h-[7px] w-[7px] rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700" />
                          <div className="mb-1 flex justify-between items-baseline"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{formatDate(log.timestamp)} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{log.details}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono uppercase tracking-widest">{log.action}</span>
                          </div>
                        </div>
                    ))}
                    {filteredLogs.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                          <History size={40} className="mx-auto mb-4 opacity-20" />
                          <p className="text-sm italic dark:text-slate-500">No activity recorded for this organization.</p>
                        </div>
                    )}
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>
      </div>
  );
}