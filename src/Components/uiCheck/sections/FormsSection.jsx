import { useState } from 'react'
import { Input, Select, Checkbox, ColorInput, DepartmentSelect } from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'
import { CatalogTable } from '../shared.jsx'

const FORM_USAGE = [
  { component: 'Input', files: 'TaskForm, user modals, useConfirm, LookupManager, DynamicForm' },
  { component: 'Select', files: 'TaskForm, DashboardPage filter, DynamicForm' },
  { component: 'DepartmentSelect', files: 'CreateUserModal, EditUserModal, DynamicForm' },
  { component: 'Checkbox', files: 'TaskForm, DynamicForm' },
  { component: 'ColorInput', files: 'EditUserModal, LookupManager, PreviewFolderCard' },
  { component: 'PickerFormShell', files: 'ExportConfigForm, SlideConfigForm' },
  { component: 'ScopePickerSections', files: 'ExportConfigForm, SlideConfigForm' },
]

export default function FormsSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'forms')
  const [color, setColor] = useState('#2563eb')
  const [checked, setChecked] = useState(true)

  return (
    <UiCheckSection
      id="forms"
      title="Inputs & forms"
      description="Shared form controls. CSS: .input-wrap · .input · .input-label · .checkbox-* · .input-color"
      sources={section?.sources}
    >
      <DemoCard title="Where form components are used" subtitle="See Usage map for full file paths">
        <CatalogTable
          columns={[
            { key: 'component', label: 'Component' },
            { key: 'files', label: 'Main screens' },
          ]}
          rows={FORM_USAGE}
          rowKey="component"
        />
      </DemoCard>

      <DemoCard title="Input" subtitle=".input · .input--error · .input-hint · textarea uses same .input">
        <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
          <Input label="Default" placeholder="Task name" hint="Helper text" />
          <Input label="Error" error="Required" defaultValue="bad@" />
          <Input label="Small" className="input--sm" placeholder="Filter…" />
          <Input label="Large" className="input--lg" placeholder="Login-scale field" />
          <Input as="textarea" label="Textarea" placeholder="Notes…" className="md:col-span-2" />
        </div>
      </DemoCard>

      <DemoCard title="Select & DepartmentSelect" subtitle="Both use .input on native elements">
        <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
          <Select
            label="Department"
            placeholder="Choose…"
            options={[
              { value: 'dev', label: 'Developer' },
              { value: 'design', label: 'Design' },
            ]}
          />
          <DepartmentSelect label="DepartmentSelect" value="" onChange={() => {}} />
        </div>
      </DemoCard>

      <DemoCard title="Checkbox & ColorInput" subtitle=".checkbox-wrap · .input-color">
        <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
          <Checkbox
            label="Enable variations"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <ColorInput label="Calendar color" value={color} onChange={setColor} />
        </div>
      </DemoCard>
    </UiCheckSection>
  )
}
