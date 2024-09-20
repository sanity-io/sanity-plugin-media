import {DocumentsIcon} from '@sanity/icons'
import {PROJECT_DOCUMENT_NAME} from '../constants'

export default {
  title: 'Media Project',
  icon: DocumentsIcon,
  name: PROJECT_DOCUMENT_NAME,
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'slug'
    },
    {
      title: 'Project Number',
      name: 'project_number',
      type: 'number'
    },
    {
      title: 'Address',
      name: 'address',
      type: 'text'
    },
    {
      title: 'Marketing Name',
      name: 'marketing_name',
      type: 'string'
    },
    {
      title: 'Former Marketing Name',
      name: 'former_marketing_name',
      type: 'string'
    },
    {
      title: 'The Brooklyn Studio Website',
      name: 'website',
      type: 'url'
    },
    {
      title: 'Client Name 1',
      name: 'client_name_1',
      type: 'string'
    },
    {
      title: 'Client Name 2',
      name: 'client_name_2',
      type: 'string'
    },
    {
      title: 'Completed Size/Area (in square feet)',
      name: 'completed_size',
      type: 'number'
    },
    {
      title: 'Completed Cellar Size/Area (in square feet)',
      name: 'completed_cellar_size',
      type: 'number'
    },
    {
      title: 'Number of Stories',
      name: 'number_of_stories',
      type: 'number'
    },
    {
      title: 'Lot Width (in feet)',
      name: 'lot_width',
      type: 'number'
    },
    {
      title: 'Lot Length (in feet)',
      name: 'lot_length',
      type: 'number'
    },
    {
      title: 'Building Length (in feet)',
      name: 'building_length',
      type: 'number'
    },
    {
      title: 'Project Start Date',
      name: 'project_start_date',
      type: 'date'
    },
    {
      title: 'Design Duration',
      name: 'design_duration',
      type: 'string'
    },
    {
      title: 'Construction Duration',
      name: 'construction_duration',
      type: 'string'
    },
    {
      title: 'Project Completion Date',
      name: 'project_completion_date',
      type: 'date'
    },
    {
      title: 'Cost',
      description: 'Total cost of the project (USD)',
      name: 'cost',
      type: 'number'
    },
    {
      title: 'Cost/Square Foot',
      description: 'Cost per square foot of the project (USD)',
      name: 'cost_per_square_foot',
      type: 'number'
    },
    {
      title: 'Block',
      name: 'block',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      title: 'Lot',
      name: 'lot',
      type: 'string'
    },
    {
      title: 'Zoning District(s)',
      name: 'zoning_districts',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      title: 'Landmarked',
      name: 'landmarked',
      type: 'boolean'
    },
    {
      title: 'Historic District',
      name: 'historic_district',
      type: 'string'
    },
    {
      title: 'Landmark Designation Date',
      name: 'landmark_designation_date',
      type: 'date'
    },
    {
      title: 'LPC Designation Report',
      name: 'lpc_designation_report',
      type: 'text'
    },
    {
      title: 'Original Architect / Builder',
      name: 'original_architect_builder',
      type: 'string'
    },
    {
      title: 'Original Owner/Developer',
      name: 'original_owner_developer',
      type: 'string'
    },
    {
      title: 'Original Construction Date',
      name: 'original_construction_date',
      type: 'date'
    },
    {
      title: 'Original Architectural Style',
      name: 'original_architectural_style',
      type: 'string'
    },
    {
      title: 'Original Size/Area (in square feet)',
      name: 'original_size',
      type: 'number'
    },
    {
      title: 'Project Description',
      name: 'project_description',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      title: 'Excerpt from LPC Report',
      name: 'excerpt_from_lpc_report',
      type: 'text'
    },
    {
      title: 'Partner In Charge',
      name: 'partner_in_charge',
      type: 'string'
    },
    {
      title: 'Project Team',
      name: 'project_team',
      type: 'string'
    },
    {
      title: 'Interior Design',
      name: 'interior_design',
      type: 'string'
    },
    {
      title: 'Developer/Client',
      name: 'developer_client',
      type: 'string'
    },
    {
      title: 'Contractor',
      name: 'contractor',
      type: 'string'
    },
    {
      title: 'Engineer(s)',
      name: 'engineers',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      title: 'Landscape Design',
      name: 'landscape_design',
      type: 'string'
    },
    {
      title: 'Expeditor',
      name: 'expeditor',
      type: 'string'
    },
    {
      title: 'Land Use Attorney',
      name: 'land_use_attorney',
      type: 'string'
    },
    {
      title: 'Consultant(s)',
      name: 'consultants',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      title: 'Lighting Design',
      name: 'lighting_design',
      type: 'string'
    },
    {
      title: 'Solar Energy Equipment Provider',
      name: 'solar_energy_equipment_provider',
      type: 'string'
    },
    {
      title: 'Photographer(s)',
      name: 'photographers',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      title: 'Stylist/Staging',
      name: 'stylist_staging',
      type: 'string'
    },
    {
      title: 'Awards and Recognition',
      name: 'awards_recognition',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      title: 'Press Coverage',
      name: 'press_coverage',
      type: 'array',
      of: [{type: 'string'}]
    }
  ],
  preview: {
    select: {
      name: 'name'
    },
    prepare(selection: any) {
      const {name} = selection
      return {
        media: DocumentsIcon,
        title: name?.current
      }
    }
  }
}
