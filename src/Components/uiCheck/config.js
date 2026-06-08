/** Sidebar groups and section anchors for the UI Check page. */
export const UI_CHECK_SECTIONS = [
  {
    group: 'Start',
    id: 'overview',
    label: 'Overview',
    sources: ['src/components/ui/index.js', 'src/index.css'],
  },
  {
    group: 'Start',
    id: 'loaders',
    label: 'Loaders',
    sources: [
      'src/components/ui/Loader.jsx',
      'src/components/ui/AsyncProgressBar.jsx',
    ],
  },
  {
    group: 'Actions',
    id: 'buttons',
    label: 'Buttons',
    sources: ['src/components/ui/Button.jsx'],
  },
  {
    group: 'Actions',
    id: 'badges',
    label: 'Badges',
    sources: [
      'src/components/ui/Badge.jsx',
      'src/components/ui/ToggleOptionBadge.jsx',
      'src/components/ui/ActiveToggleBadge.jsx',
      'src/components/ui/ErrorBadge.jsx',
    ],
  },
  {
    group: 'Forms',
    id: 'forms',
    label: 'Inputs & forms',
    sources: [
      'src/components/ui/Input.jsx',
      'src/components/ui/Select.jsx',
      'src/components/ui/Checkbox.jsx',
      'src/components/ui/ColorInput.jsx',
      'src/components/ui/DepartmentSelect.jsx',
      'src/components/ui/PickerFormShell.jsx',
      'src/components/ui/ScopePickerSections.jsx',
    ],
  },
  {
    group: 'Layout',
    id: 'modals',
    label: 'Modals',
    sources: [
      'src/components/ui/Modal.jsx',
      'src/components/ui/ModalTitle.jsx',
      'src/components/ui/SlideProgressModal.jsx',
    ],
  },
  {
    group: 'Layout',
    id: 'cards',
    label: 'Cards & titles',
    sources: [
      'src/components/ui/Card.jsx',
      'src/components/ui/SummaryCard.jsx',
      'src/components/ui/PageTitle.jsx',
    ],
  },
  {
    group: 'Layout',
    id: 'tabs',
    label: 'Tabs',
    sources: ['src/components/ui/Tabs.jsx'],
  },
  {
    group: 'Data display',
    id: 'avatars',
    label: 'Avatars',
    sources: ['src/components/ui/Avatar.jsx'],
  },
  {
    group: 'Data display',
    id: 'skeletons',
    label: 'Skeletons',
    sources: ['src/components/ui/Skeleton.jsx'],
  },
  {
    group: 'Feedback',
    id: 'alerts',
    label: 'Alerts & banners',
    sources: ['src/index.css', 'src/features/tasks/components/TaskForm/TaskForm.jsx'],
  },
  {
    group: 'Reference',
    id: 'css',
    label: 'CSS classes',
    sources: ['src/index.css'],
  },
]

export const UI_CHECK_GROUPS = [...new Set(UI_CHECK_SECTIONS.map((s) => s.group))]
