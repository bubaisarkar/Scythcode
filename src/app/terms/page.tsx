import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Scythcode',
  description: 'Terms of service and conditions for using Scythcode web development services.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms and Conditions</h1>
            <p className="text-gray-400 mb-8">Effective Date: June 5, 2026</p>

            <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using Scythcode's website and services ("Services"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Services.
                </p>
                <p className="mt-4">
                  These Terms constitute a legally binding agreement between you ("Client," "you," or "your") and Scythcode ("we," "us," or "our").
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Services Offered</h2>
                <p>Scythcode provides professional web development services, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Custom web application development</li>
                  <li>Website design and development</li>
                  <li>Frontend and backend development</li>
                  <li>API development and integration</li>
                  <li>Database design and implementation</li>
                  <li>Authentication and security solutions</li>
                  <li>Maintenance and support services</li>
                </ul>
                <p className="mt-4">
                  Specific services, deliverables, timelines, and pricing will be outlined in individual project agreements or proposals.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. User Accounts</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">3.1 Account Creation</h3>
                <p>
                  To access certain features, you may need to create an account using Google or GitHub authentication. You are responsible for maintaining the confidentiality of your account and all activities under it.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">3.2 Account Requirements</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You must not impersonate others or provide false information</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">3.3 Account Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Project Agreements</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">4.1 Proposals and Quotes</h3>
                <p>
                  All project proposals and quotes are valid for 30 days unless otherwise specified. Prices are subject to change based on scope modifications.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">4.2 Scope of Work</h3>
                <p>
                  Each project will have a defined scope of work. Any changes or additions to the scope may result in additional charges and timeline adjustments.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">4.3 Client Responsibilities</h3>
                <p>Clients are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Providing timely feedback and approvals</li>
                  <li>Supplying necessary content, assets, and credentials</li>
                  <li>Communicating requirements clearly</li>
                  <li>Making timely payments as agreed</li>
                  <li>Ensuring they have rights to all provided materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Payment Terms</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">5.1 Payment Schedule</h3>
                <p>Payment terms will be specified in each project agreement. Typical payment structures include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>50% upfront deposit before work begins</li>
                  <li>50% upon project completion and delivery</li>
                  <li>Milestone-based payments for larger projects</li>
                </ul>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">5.2 Accepted Payment Methods</h3>
                <p>
                  We accept credit cards, debit cards, bank transfers, and other payment methods as specified in your project agreement.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">5.3 Late Payments</h3>
                <p>
                  Late payments may result in project delays, suspension of work, or late fees of 1.5% per month (18% annually) on outstanding balances.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">5.4 Taxes</h3>
                <p>
                  All prices are exclusive of applicable taxes unless otherwise stated. You are responsible for any sales, use, or other taxes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Intellectual Property Rights</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">6.1 Client-Provided Materials</h3>
                <p>
                  You retain ownership of all content, trademarks, and materials you provide. You grant us a license to use these materials solely for the purpose of completing your project.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">6.2 Deliverables</h3>
                <p>
                  Upon full payment, you will own the final deliverables created specifically for your project. We retain the right to use general methodologies, techniques, and knowledge gained.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">6.3 Third-Party Components</h3>
                <p>
                  Projects may include third-party libraries, frameworks, or tools subject to their own licenses. You agree to comply with these licenses.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">6.4 Portfolio Rights</h3>
                <p>
                  We reserve the right to display completed projects in our portfolio and marketing materials unless you request confidentiality in writing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Warranties and Disclaimers</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">7.1 Service Warranty</h3>
                <p>
                  We warrant that services will be performed in a professional and workmanlike manner consistent with industry standards.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">7.2 Bug Fixes</h3>
                <p>
                  We provide a 30-day warranty period for bug fixes on delivered work, provided the bugs are not caused by modifications made by you or third parties.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">7.3 Disclaimer</h3>
                <p>
                  EXCEPT AS EXPRESSLY PROVIDED, SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Limitation of Liability</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SCYTHCODE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p className="mt-4">
                  OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SPECIFIC SERVICE GIVING RISE TO THE CLAIM.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Confidentiality</h2>
                <p>
                  We will maintain the confidentiality of any proprietary information you share with us during the course of our engagement. We will not disclose such information to third parties without your consent, except as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Termination</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">10.1 Termination by Client</h3>
                <p>
                  You may terminate a project at any time with written notice. You will be charged for work completed up to the termination date plus any non-refundable expenses incurred.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">10.2 Termination by Scythcode</h3>
                <p>
                  We may terminate a project if you fail to meet payment obligations, fail to provide necessary materials, or breach these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Indemnification</h2>
                <p>
                  You agree to indemnify and hold Scythcode harmless from any claims, damages, losses, or expenses (including legal fees) arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Dispute Resolution</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">12.1 Negotiation</h3>
                <p>
                  In the event of a dispute, parties agree to first attempt to resolve the matter through good-faith negotiation.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">12.2 Arbitration</h3>
                <p>
                  If negotiation fails, disputes will be resolved through binding arbitration in accordance with applicable arbitration rules, rather than in court.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting the updated Terms on our website. Your continued use of our services after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">14. General Provisions</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">14.1 Governing Law</h3>
                <p>
                  These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">14.2 Severability</h3>
                <p>
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">14.3 Entire Agreement</h3>
                <p>
                  These Terms, together with any project agreements, constitute the entire agreement between you and Scythcode regarding our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">15. Contact Information</h2>
                <p>
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-900/50 rounded-lg p-6 mt-4">
                  <p><strong className="text-white">Scythcode</strong></p>
                  <p>Email: <a href="mailto:dantethedev@gmail.com" className="text-cyan-400 hover:text-cyan-300">dantethedev@gmail.com</a></p>
                  <p>Website: <a href="/contact" className="text-cyan-400 hover:text-cyan-300">www.scythcode.com/contact</a></p>
                </div>
              </section>

              <section className="mt-12 pt-8 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  By using Scythcode's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
