export interface User {
  user_id: string
  email: string
  name: string
  membership_status: 'active' | 'pro_max' | 'none' | 'cancelled'
  created_at: string
  stripe_customer_id?: string
}

export interface Template {
  template_id: string
  title: string
  category: 'basic' | 'professional' | 'digital-products'
  type: '2d' | '3d'
  preview_image: string
  price: number
  description: string
  published: boolean
  bundle_html?: string
}

export interface Purchase {
  purchase_id: string
  user_id: string
  template_id: string
  stripe_payment_id: string
  purchase_date: string
}

export interface Website {
  website_id: string
  owner_id: string
  template_id: string
  slug?: string
  domain?: string
  html_content?: string
  hosting_status: 'none' | 'pending' | 'active'
  publish_status: 'draft' | 'published' | 'unpublished'
  created_at: string
}

export interface Domain {
  domain_id: string
  user_id: string
  domain_name: string
  registrar: string
  expiry_date: string
}

export interface AIProject {
  project_id: string
  owner_id: string
  prompt: string
  generated_content: string
  created_at: string
}
