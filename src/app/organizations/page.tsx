import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CreateOrganizationButton from './components/create-organization-button'
import OrganizationSelect from './components/organization-select'
import OrganizationTabs from './components/organization-tabs'

export default function organizationPage() {
  return (
    <div className="container mx-auto my-6 px-4">
      <Link href="/" className="inline-flex items-center mb-6">
      <ArrowLeft className='size-4 mr-2'/>
       Back to Home
      </Link>
      <div className='flex items-center mb-8 gap-2'>
         <OrganizationSelect/>
         <CreateOrganizationButton/>
      </div>

      <OrganizationTabs/>
    </div>
  )
}
