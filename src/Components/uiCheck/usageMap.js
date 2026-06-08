/**
 * Where each shared UI component is imported in this repo.
 * Excludes src/pages/management/uiCheck/* (this reference page only).
 * Regenerate when adding new UI — keep in sync with grep on components/ui imports.
 */
export const UI_USAGE_MAP = [
  {
    component: 'Loader',
    source: 'src/components/ui/Loader.jsx',
    css: 'spinner (no dedicated class)',
    usages: [
      { file: 'src/app/router.jsx', note: 'Suspense fallback + auth loading gates' },
    ],
  },
  {
    component: 'ProgressLoader',
    source: 'src/components/ui/Loader.jsx',
    css: '.chat-sync-progress__bar--active · .chat-sync-progress__label',
    usages: [
      { file: 'src/components/Table/DataTable.jsx', note: 'Table body loading' },
      { file: 'src/features/chatAssets/components/ChatAssetGrid.jsx', note: 'Initial asset grid load' },
      { file: 'src/features/analytics/components/AnalyticsDashboardShell.jsx', note: 'Analytics tab content loading' },
      { file: 'src/features/tasks/components/TaskForm/TaskForm.jsx', note: 'Save overlay · task-form__overlay' },
      { file: 'src/features/chatAssets/components/FullSyncPanel.jsx', note: 'Chat history import panel' },
      { file: 'src/features/chatAssets/components/FloatingSyncBar.jsx', note: 'Floating sync toast' },
    ],
  },
  {
    component: 'AsyncProgressBar',
    source: 'src/components/ui/AsyncProgressBar.jsx',
    css: '.progress-bar · .progress-bar__fill · .progress-bar--indeterminate',
    usages: [
      { file: 'src/components/ui/SlideProgressModal.jsx', note: 'Slide generation with counts' },
    ],
  },
  {
    component: 'Button',
    source: 'src/components/ui/Button.jsx',
    css: '.btn-primary · .btn-secondary · .btn-outline · .btn-ghost · .btn-danger-muted · .btn-tone--* · .btn-sm · .btn-lg',
    usages: [
      { file: 'src/pages/DashboardPage.jsx', note: 'Create board, retry, slide actions' },
      { file: 'src/pages/SettingsPage.jsx', note: 'Export my data' },
      { file: 'src/pages/ChatAssetsPage.jsx', note: 'Connect Chat' },
      { file: 'src/pages/ImagePreviewPage.jsx', note: 'Toolbar, clear all' },
      { file: 'src/pages/management/ManagementUsersPage.jsx', note: 'Add user' },
      { file: 'src/pages/management/ManagementDeliverablesPage.jsx', note: 'Add deliverable' },
      { file: 'src/components/Table/DataTable.jsx', note: 'Export, pagination' },
      { file: 'src/components/layout/TopNav.jsx', note: 'Menu, profile actions' },
      { file: 'src/components/layout/FixedHeader.jsx', note: 'Mobile header menu' },
      { file: 'src/components/layout/ThemeToggle.jsx', note: 'Light/dark toggle' },
      { file: 'src/components/integrations/TempoRequiredBanner.jsx', note: 'Connect Tempo' },
      { file: 'src/components/LookupManager.jsx', note: 'Lookup CRUD actions' },
      { file: 'src/hooks/useConfirm.jsx', note: 'Confirm / Cancel' },
      { file: 'src/context/AuthContext.jsx', note: 'Session modal actions' },
      { file: 'src/features/tasks/components/TaskForm/TaskForm.jsx', note: 'Submit, Jira edit xs buttons' },
      { file: 'src/features/tasks/components/TaskTable/TaskTable.jsx', note: 'Generate slides' },
      { file: 'src/features/tasks/components/TaskTable/TaskFilterBar.jsx', note: 'Filter actions' },
      { file: 'src/features/chatAssets/components/*', note: 'Toolbar, filter bar, sync panel, detail modal' },
      { file: 'src/features/dashboard/components/CreateBoardModal.jsx', note: 'Cancel' },
      { file: 'src/features/users/CreateUserModal.jsx', note: 'Close, submit' },
      { file: 'src/features/users/EditUserModal.jsx', note: 'Close, submit' },
      { file: 'src/features/onboarding/OnboardingModal.jsx', note: 'Get started' },
      { file: 'src/features/exports/components/ExportConfigForm.jsx', note: 'Export confirm' },
      { file: 'src/features/presentations/components/SlideConfigForm.jsx', note: 'Generate presentation' },
      { file: 'src/features/imagePreview/components/PreviewModal.jsx', note: 'Commit, close' },
      { file: 'src/components/Form/DynamicForm.jsx', note: 'Dynamic form submit' },
    ],
  },
  {
    component: 'Input',
    source: 'src/components/ui/Input.jsx',
    css: '.input-wrap · .input · .input-label · .input-error · .input-hint · .input--sm · .input--lg',
    usages: [
      { file: 'src/features/tasks/components/TaskForm/TaskForm.jsx', note: 'All task fields' },
      { file: 'src/features/users/CreateUserModal.jsx', note: 'Name, email, password' },
      { file: 'src/features/users/EditUserModal.jsx', note: 'User fields' },
      { file: 'src/hooks/useConfirm.jsx', note: 'Type-to-confirm field' },
      { file: 'src/components/LookupManager.jsx', note: 'Lookup value forms' },
      { file: 'src/components/Form/DynamicForm.jsx', note: 'Generic dynamic fields' },
    ],
  },
  {
    component: 'Select',
    source: 'src/components/ui/Select.jsx',
    css: '.input (native select styling)',
    usages: [
      { file: 'src/features/tasks/components/TaskForm/TaskForm.jsx', note: 'Product, deliverables, etc.' },
      { file: 'src/pages/DashboardPage.jsx', note: 'Board user filter' },
      { file: 'src/components/Form/DynamicForm.jsx', note: 'Dynamic select fields' },
    ],
  },
  {
    component: 'DepartmentSelect',
    source: 'src/components/ui/DepartmentSelect.jsx',
    css: '.input',
    usages: [
      { file: 'src/features/users/CreateUserModal.jsx', note: 'User department' },
      { file: 'src/features/users/EditUserModal.jsx', note: 'User department' },
      { file: 'src/components/Form/DynamicForm.jsx', note: 'Department field type' },
    ],
  },
  {
    component: 'Checkbox',
    source: 'src/components/ui/Checkbox.jsx',
    css: '.checkbox-wrap · .checkbox-input · .checkbox-label',
    usages: [
      { file: 'src/features/tasks/components/TaskForm/TaskForm.jsx', note: 'Variations, AI flags' },
      { file: 'src/components/Form/DynamicForm.jsx', note: 'Boolean fields' },
    ],
  },
  {
    component: 'ColorInput',
    source: 'src/components/ui/ColorInput.jsx',
    css: '.input-color',
    usages: [
      { file: 'src/features/users/EditUserModal.jsx', note: 'User calendar color' },
      { file: 'src/features/imagePreview/components/PreviewFolderCard.jsx', note: 'Folder accent color' },
      { file: 'src/components/LookupManager.jsx', note: 'Lookup color field' },
    ],
  },
  {
    component: 'Badge',
    source: 'src/components/ui/Badge.jsx',
    css: '.badge · .badge--*',
    usages: [
      { file: 'src/components/Table/usersColumns.jsx', note: 'Edit action (as button)' },
      { file: 'src/components/Table/deliverablesColumns.jsx', note: 'Edit action (as button)' },
      { file: 'src/components/Table/lookupColumns.jsx', note: 'Edit action (as button)' },
      { file: 'src/components/Table/taskColumns.jsx', note: 'Product, deliverable, status chips' },
      { file: 'src/components/Table/landingPageColumns.jsx', note: 'LP status chip' },
      { file: 'src/components/layout/TopNav.jsx', note: 'Department badge in menu' },
      { file: 'src/components/layout/FixedHeader.jsx', note: 'Profile department' },
      { file: 'src/pages/DashboardPage.jsx', note: 'Active board badge' },
      { file: 'src/features/dashboard/components/BoardCard.jsx', note: 'Active / Closed' },
      { file: 'src/features/tasks/components/TaskForm/TaskForm.jsx', note: 'Jira / Tempo status badges' },
      { file: 'src/features/tasks/components/TaskForm/TaskFormModal.jsx', note: 'Add/edit task + delete' },
      { file: 'src/features/tasks/components/TaskForm/TaskHoursDisplay.jsx', note: 'Hours summary chips' },
      { file: 'src/features/chatAssets/components/ChatAssetDetailModal.jsx', note: 'Category tag' },
      { file: 'src/features/analytics/components/ComparisonTable.jsx', note: 'Comparison labels' },
      { file: 'src/components/ui/ModalTitle.jsx', note: 'Modal header badge' },
    ],
  },
  {
    component: 'ToggleOptionBadge',
    source: 'src/components/ui/ToggleOptionBadge.jsx',
    css: 'Badge accent/slate + aria-pressed',
    usages: [
      { file: 'src/features/tasks/components/TaskForm/TaskForm.jsx', note: 'Markets & departments multi-select' },
      { file: 'src/features/exports/components/ExportConfigForm.jsx', note: 'Export scope pickers' },
    ],
  },
  {
    component: 'ActiveToggleBadge',
    source: 'src/components/ui/ActiveToggleBadge.jsx',
    css: 'Badge accent/slate toggle',
    usages: [
      { file: 'src/components/Table/usersColumns.jsx', note: 'User active/inactive' },
      { file: 'src/components/Table/lookupColumns.jsx', note: 'Lookup active toggle' },
    ],
  },
  {
    component: 'ErrorBadge',
    source: 'src/components/ui/ErrorBadge.jsx',
    css: '.badge--success · .badge--error',
    usages: [
      { file: 'src/features/analytics/components/AnalyticsTable.jsx', note: 'Diff / variance chips' },
    ],
  },
  {
    component: 'Avatar',
    source: 'src/components/ui/Avatar.jsx',
    css: 'inline ring + initials (no .avatar class)',
    usages: [
      { file: 'src/components/Table/usersColumns.jsx', note: 'User row avatar' },
      { file: 'src/components/Table/taskColumns.jsx', note: 'Task owner column' },
      { file: 'src/components/layout/TopNav.jsx', note: 'Profile trigger' },
      { file: 'src/components/layout/FixedHeader.jsx', note: 'Mobile profile' },
      { file: 'src/features/tasks/components/TaskForm/TaskOwnerBadge.jsx', note: 'Task owner in form' },
    ],
  },
  {
    component: 'Modal',
    source: 'src/components/ui/Modal.jsx',
    css: '.modal-backdrop · .modal-panel · .modal-header · .modal-body · .modal-footer',
    usages: [
      { file: 'src/components/Table/DataTable.jsx', note: 'Export CSV modal' },
      { file: 'src/pages/DashboardPage.jsx', note: 'Board modals, slide config' },
      { file: 'src/pages/ImagePreviewPage.jsx', note: 'Folder error modal' },
      { file: 'src/pages/management/ManagementDeliverablesPage.jsx', note: 'Deliverable form' },
      { file: 'src/hooks/useConfirm.jsx', note: 'Global confirm dialog' },
      { file: 'src/context/AuthContext.jsx', note: 'Auth/session prompt' },
      { file: 'src/features/tasks/components/TaskForm/TaskFormModal.jsx', note: 'Add/edit task' },
      { file: 'src/features/users/*Modal.jsx', note: 'Create / edit user' },
      { file: 'src/features/chatAssets/components/ChatAssetDetailModal.jsx', note: 'Asset detail' },
      { file: 'src/features/analytics/components/*', note: 'Drill-down modals' },
      { file: 'src/features/dashboard/components/CreateBoardModal.jsx', note: 'New board' },
      { file: 'src/features/onboarding/OnboardingModal.jsx', note: 'First-run onboarding' },
      { file: 'src/features/imagePreview/components/PreviewModal.jsx', note: 'Image crop preview' },
      { file: 'src/components/LookupManager.jsx', note: 'Add/edit lookup' },
    ],
  },
  {
    component: 'ModalTitle',
    source: 'src/components/ui/ModalTitle.jsx',
    css: '.modal-title',
    usages: [
      { file: 'src/components/Table/DataTable.jsx', note: 'Export modal title' },
      { file: 'src/pages/DashboardPage.jsx', note: 'Slide / board modals' },
      { file: 'src/features/tasks/components/TaskForm/TaskFormModal.jsx', note: 'Task modal headers' },
      { file: 'src/features/analytics/components/*', note: 'Analytics drill-down titles' },
    ],
  },
  {
    component: 'SlideProgressModal',
    source: 'src/components/ui/SlideProgressModal.jsx',
    css: 'Modal + AsyncProgressBar',
    usages: [
      { file: 'src/pages/DashboardPage.jsx', note: 'Generate board presentation' },
    ],
  },
  {
    component: 'Tabs',
    source: 'src/components/ui/Tabs.jsx',
    css: '.tabs · .tabs__tab · .tabs__tab--selected',
    usages: [
      { file: 'src/components/layout/ContextBar.jsx', note: 'Dashboard, Management, Analytics top rows' },
      { file: 'src/components/LookupManager.jsx', note: 'Markets, Products, Departments, AI Used' },
    ],
  },
  {
    component: 'Card',
    source: 'src/components/ui/Card.jsx',
    css: '.card · .card-header · .card--padded · .card--no-padding',
    usages: [
      { file: 'src/pages/DashboardPage.jsx', note: 'Dashboard panels' },
      { file: 'src/pages/ChatAssetsPage.jsx', note: 'Assets page shell' },
      { file: 'src/features/analytics/components/AnalyticsTable.jsx', note: 'Analytics table shell' },
    ],
  },
  {
    component: 'SummaryCard',
    source: 'src/components/ui/SummaryCard.jsx',
    css: '.card · .summary-card__icon · __label · __value · __detail',
    usages: [
      { file: 'src/pages/DashboardPage.jsx', note: 'Board summary KPIs' },
      { file: 'src/pages/LandingPagesPage.jsx', note: 'LP stats row' },
      { file: 'src/features/analytics/components/AnalyticsKpiStrip.jsx', note: 'Analytics KPI strip' },
    ],
  },
  {
    component: 'PageTitle',
    source: 'src/components/ui/PageTitle.jsx',
    css: '.page-title',
    usages: [
      { file: 'src/pages/DashboardPage.jsx', note: '—' },
      { file: 'src/pages/AnalyticsPage.jsx', note: '—' },
      { file: 'src/pages/SettingsPage.jsx', note: '—' },
      { file: 'src/pages/ChatAssetsPage.jsx', note: '—' },
      { file: 'src/pages/LandingPagesPage.jsx', note: '—' },
      { file: 'src/pages/AuditDocsPage.jsx', note: '—' },
      { file: 'src/pages/ImagePreviewPage.jsx', note: '—' },
      { file: 'src/pages/management/*Page.jsx', note: 'All management pages' },
    ],
  },
  {
    component: 'SkeletonSummaryCards',
    source: 'src/components/ui/Skeleton.jsx',
    css: '.skeleton · .card',
    usages: [
      { file: 'src/pages/DashboardPage.jsx', note: 'KPI row while loading' },
    ],
  },
  {
    component: 'SkeletonBoardCards',
    source: 'src/components/ui/Skeleton.jsx',
    css: '.skeleton · .skeleton-card',
    usages: [
      { file: 'src/pages/DashboardPage.jsx', note: 'History boards grid (if used)' },
    ],
  },
  {
    component: 'SkeletonTable',
    source: 'src/components/ui/Skeleton.jsx',
    css: '.skeleton · .skeleton-table',
    usages: [
      { file: 'src/components/ui/Skeleton.jsx', note: 'Exported layout; use inline .skeleton elsewhere' },
    ],
  },
  {
    component: '.skeleton (inline)',
    source: 'src/index.css',
    css: '.skeleton',
    usages: [
      { file: 'src/features/analytics/components/AnalyticsKpiStrip.jsx', note: 'KPI loading placeholders' },
      { file: 'src/components/integrations/PageIntegrationsBar.jsx', note: 'Integration bar loading' },
      { file: 'src/features/imagePreview/components/PreviewModal.jsx', note: 'Image loading' },
      { file: 'src/features/imagePreview/components/PreviewFolderCard.jsx', note: 'Thumbnail loading' },
    ],
  },
  {
    component: 'PickerFormShell',
    source: 'src/components/ui/PickerFormShell.jsx',
    css: 'form layout wrapper',
    usages: [
      { file: 'src/features/exports/components/ExportConfigForm.jsx', note: 'Export picker form' },
      { file: 'src/features/presentations/components/SlideConfigForm.jsx', note: 'Slide scope picker' },
    ],
  },
  {
    component: 'ScopePickerSections',
    source: 'src/components/ui/ScopePickerSections.jsx',
    css: 'picker section blocks',
    usages: [
      { file: 'src/features/exports/components/ExportConfigForm.jsx', note: 'Department/product scope' },
      { file: 'src/features/presentations/components/SlideConfigForm.jsx', note: 'Slide section pickers' },
    ],
  },
]

/** Per-page summary — which UI primitives appear on each route. */
export const PAGE_UI_MAP = [
  {
    page: 'Dashboard',
    route: '/dashboard',
    file: 'src/pages/DashboardPage.jsx',
    components: ['PageTitle', 'SummaryCard', 'SkeletonSummaryCards', 'Card', 'Button', 'Select', 'Badge', 'Modal', 'ModalTitle', 'SlideProgressModal'],
  },
  {
    page: 'Analytics',
    route: '/analytics',
    file: 'src/pages/AnalyticsPage.jsx',
    components: ['PageTitle', 'SummaryCard', '.skeleton (inline)', 'ProgressLoader', 'Card', 'Modal', 'Badge', 'ErrorBadge'],
  },
  {
    page: 'Settings (user)',
    route: '/settings',
    file: 'src/pages/SettingsPage.jsx',
    components: ['PageTitle', 'Button', 'DataTable → ProgressLoader'],
  },
  {
    page: 'Chat Assets',
    route: '/chat-assets',
    file: 'src/pages/ChatAssetsPage.jsx',
    components: ['PageTitle', 'Card', 'Button', 'ProgressLoader', 'FullSyncPanel', 'FloatingSyncBar'],
  },
  {
    page: 'Landing Pages',
    route: '/landing-pages',
    file: 'src/pages/LandingPagesPage.jsx',
    components: ['PageTitle', 'SummaryCard', 'DataTable → ProgressLoader', 'Badge'],
  },
  {
    page: 'Image Preview',
    route: '/image-preview',
    file: 'src/pages/ImagePreviewPage.jsx',
    components: ['PageTitle', 'Button', 'Modal', 'ColorInput', '.skeleton (inline)'],
  },
  {
    page: 'Audit docs',
    route: '/audit',
    file: 'src/pages/AuditDocsPage.jsx',
    components: ['PageTitle', 'AnalyticsSectionNav (not Tabs)'],
  },
  {
    page: 'Login',
    route: '/login',
    file: 'src/pages/LoginPage.jsx',
    components: ['ThemeToggle → Button', 'Custom .login-submit (not Button)'],
    note: 'Sign-in uses native button + .login-spinner, not shared Button',
  },
  {
    page: 'Management · Users',
    route: '/management/users',
    file: 'src/pages/management/ManagementUsersPage.jsx',
    components: ['PageTitle', 'Button', 'DataTable', 'CreateUserModal → Input, DepartmentSelect'],
  },
  {
    page: 'Management · Deliverables',
    route: '/management/deliverables',
    file: 'src/pages/management/ManagementDeliverablesPage.jsx',
    components: ['PageTitle', 'Button', 'Modal', 'DynamicForm → Input, Select, Checkbox'],
  },
  {
    page: 'Management · Settings',
    route: '/management/settings',
    file: 'src/pages/management/ManagementSettingsPage.jsx',
    components: ['PageTitle', 'LookupManager → Tabs, Input, Button, Modal, Badge, ColorInput'],
  },
  {
    page: 'Management · UI Check',
    route: '/management/ui-check',
    file: 'src/pages/management/UiCheckPage.jsx',
    components: ['All ui/* demos (this page)'],
  },
  {
    page: 'Router / auth',
    route: '/*',
    file: 'src/app/router.jsx',
    components: ['Loader'],
  },
]

/** Components exported from index.js but worth noting if missing from map */
export const NOT_IN_INDEX = [
  { name: 'SlideProgressModal', file: 'src/components/ui/SlideProgressModal.jsx', note: 'Imported directly from file' },
  { name: 'PickerFormShell', file: 'src/components/ui/PickerFormShell.jsx', note: 'Not in index.js barrel' },
  { name: 'ScopePickerSections', file: 'src/components/ui/ScopePickerSections.jsx', note: 'Not in index.js barrel' },
]
