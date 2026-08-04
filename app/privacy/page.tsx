import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — allibuild.com',
  description: 'How allibuild.com collects, uses, and protects your data.',
}

const LAST_UPDATED = 'August 4, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mb-10 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-10">
        <Section title="1. Who we are">
          <p>
            allibuild.com (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates an AI-assisted website
            builder and template marketplace, and the Grow Biz Pro website service for local
            businesses. This policy explains what personal data we collect across allibuild.com
            and its subdomains, why we collect it, and the choices you have.
          </p>
        </Section>

        <Section title="2. Information we collect">
          <p>We collect information in the following ways:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <span className="text-foreground">Account information</span> — name, email address,
              and authentication data when you sign up or sign in (including via Google), handled
              by our authentication provider, Clerk.
            </li>
            <li>
              <span className="text-foreground">Business and site content</span> — text, images,
              and business details you provide to build or generate a website, stored in our
              application database.
            </li>
            <li>
              <span className="text-foreground">Payment information</span> — when you subscribe to
              a paid plan, billing is handled by Stripe. We do not store your full card details on
              our servers.
            </li>
            <li>
              <span className="text-foreground">Communications</span> — messages you send us via
              email, WhatsApp, or contact forms, and transactional emails we send you (e.g. handoff
              or account notices), sent via Resend.
            </li>
            <li>
              <span className="text-foreground">Usage data</span> — basic technical data such as IP
              address, browser type, and pages visited, for security and reliability purposes.
            </li>
          </ul>
        </Section>

        <Section title="3. How we use your information">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>To create and manage your account and provide the builder and hosting service.</li>
            <li>
              To generate website content on your behalf using AI providers (such as Anthropic,
              OpenAI, or Groq) — prompts and content you submit for generation are sent to these
              providers to produce the output you request.
            </li>
            <li>To process payments and manage subscriptions via Stripe.</li>
            <li>To publish and host your website, including via Cloudflare Pages.</li>
            <li>
              To connect your site to third-party accounts you authorize, such as Meta/Instagram
              business tools, if you choose to enable that integration.
            </li>
            <li>To respond to support requests and send service-related communications.</li>
            <li>To detect, prevent, and address fraud, abuse, or security issues.</li>
          </ul>
        </Section>

        <Section title="4. Sharing your information">
          <p>
            We do not sell your personal data. We share data only with the service providers
            necessary to operate allibuild.com — including Clerk (authentication), Stripe
            (payments), Airtable (application data storage), Cloudflare (hosting/deployment),
            Resend (email delivery), and AI providers used to generate content you request — and
            each processes data under their own privacy terms. If you use our partner API
            integration, business data you or a partner submit is used solely to create your
            website.
          </p>
        </Section>

        <Section title="5. Data retention">
          <p>
            We retain account and site data for as long as your account is active. If you delete
            your account or request deletion, we remove your personal data and generated site
            content within a reasonable period, except where we must retain records to comply with
            legal, tax, or accounting obligations.
          </p>
        </Section>

        <Section title="6. Your rights">
          <p>
            Depending on your location, you may have the right to access, correct, export, or
            delete your personal data, and to object to or restrict certain processing. To exercise
            any of these rights, contact us at{' '}
            <a href="mailto:contact@allibuild.com" className="underline hover:text-foreground">
              contact@allibuild.com
            </a>
            .
          </p>
        </Section>

        <Section title="7. Cookies">
          <p>
            We use essential cookies to keep you signed in and to remember basic preferences. We do
            not use third-party advertising cookies.
          </p>
        </Section>

        <Section title="8. Children's privacy">
          <p>
            allibuild.com is not directed at children under 16, and we do not knowingly collect
            personal data from children.
          </p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>
            We may update this policy from time to time. Material changes will be reflected by
            updating the &ldquo;Last updated&rdquo; date above.
          </p>
        </Section>

        <Section title="10. Contact us">
          <p>
            Questions about this policy or your data? Email{' '}
            <a href="mailto:contact@allibuild.com" className="underline hover:text-foreground">
              contact@allibuild.com
            </a>
            .
          </p>
        </Section>
      </div>

      <div className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
        <a href="/" className="underline hover:text-foreground">
          &larr; Back to allibuild.com
        </a>
      </div>
    </main>
  )
}
