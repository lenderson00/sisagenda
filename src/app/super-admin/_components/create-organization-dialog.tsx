"use client"

import { DrawerDialog } from "@/components/ui/dialog-drawer"
import { IconPlus } from "@tabler/icons-react"
import { OrganizationForm } from "./organization-form"

export const CreateOrganization = () => {
  return (
    <DrawerDialog action="Criar Organização" icon={IconPlus} title="Criar Organização" description="Crie uma nova organização militar para começar a usar o sistema.">
      <OrganizationForm />
    </DrawerDialog>
  )
}
