import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Refund Policy - Scythcode',
  description: 'Learn about Scythcode refund and cancellation policy for web development services.',
};

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Refund Policy</h1>
            <p className="text-gray-400 mb-8">Effective Date: June 5, 2026</p>

            <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Overview</h2>
                <p>
                  At Scythcode, we are committed to delivering high-quality web development services. This Refund Policy outlines the terms and conditions under which refunds may be issued for our services. We encourage clients to communicate with us throughout the project to ensure satisfaction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Service Packages</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">2.1 Starter Package</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Deposit:</strong> 50% upfront (non-refundable after work begins)</li>
                  <li><strong>Balance:</strong> Refundable before final delivery if work does not meet specifications</li>
                </ul>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">2.2 Professional Package</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Deposit:</strong> 50% upfront (non-refundable after work begins)</li>
                  <li><strong>Milestone Payments:</strong> Non-refundable once milestone is approved</li>
                  <li><strong>Final Payment:</strong> Subject to satisfaction guarantee (see section 4)</li>
                </ul>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">2.3 Enterprise Package</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Deposit:</strong> 30% upfront (non-refundable after work begins)</li>
                  <li><strong>Milestone Payments:</strong> Non-refundable once milestone is approved</li>
                  <li><strong>Custom Terms:</strong> Refund terms negotiated in project agreement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Refund Eligibility</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">3.1 Eligible for Refund</h3>
                <p>You may be eligible for a partial or full refund if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We fail to deliver the project within the agreed timeline (without valid reasons)</li>
                  <li>Deliverables do not meet the specifications outlined in the project agreement</li>
                  <li>We are unable to complete the project due to technical limitations</li>
                  <li>You cancel the project before work begins (full refund of payments made)</li>
                  <li>We breach the terms of our service agreement</li>
                </ul>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">3.2 Not Eligible for Refund</h3>
                <p>Refunds will NOT be issued if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You change your mind about the project after work has begun</li>
                  <li>You fail to provide necessary materials, feedback, or approvals in a timely manner</li>
                  <li>Delays are caused by your actions or inaction</li>
                  <li>You request significant changes beyond the agreed scope</li>
                  <li>Work has been completed and delivered according to specifications</li>
                  <li>You violate the terms of our service agreement</li>
                  <li>Third-party services or tools fail (hosting, domains, APIs, etc.)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Satisfaction Guarantee</h2>
                <p>
                  We offer a satisfaction guarantee for all our services. If the final deliverables do not meet the specifications outlined in your project agreement, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>First:</strong> Work with you to revise and correct any issues at no additional cost</li>
                  <li><strong>Second:</strong> If we cannot resolve the issues after reasonable attempts, issue a partial refund for incomplete or unsatisfactory work</li>
                </ul>
                <p className="mt-4">
                  The satisfaction guarantee applies only to work explicitly defined in the project scope. Additional features or changes requested during the project are not covered.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Cancellation Policy</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">5.1 Client-Initiated Cancellation</h3>
                <p>If you wish to cancel a project:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Before Work Begins:</strong> Full refund of all payments made</li>
                  <li><strong>After Work Begins:</strong> You will be charged for:
                    <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                      <li>Hours worked and completed deliverables</li>
                      <li>Non-refundable third-party expenses (domains, licenses, hosting setup)</li>
                      <li>Any upfront deposits as specified in your agreement</li>
                    </ul>
                  </li>
                  <li><strong>After Milestone Approval:</strong> No refund for approved milestones</li>
                </ul>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">5.2 Scythcode-Initiated Cancellation</h3>
                <p>
                  If we need to cancel a project due to circumstances beyond our control, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide written notice as soon as possible</li>
                  <li>Deliver all work completed to date</li>
                  <li>Refund any payments for work not yet completed</li>
                  <li>Assist in transitioning the project to another provider (if requested)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Refund Process</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">6.1 Request Procedure</h3>
                <p>To request a refund:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Contact us at <a href="mailto:dantethedev@gmail.com" className="text-cyan-400 hover:text-cyan-300 underline">dantethedev@gmail.com</a> with your refund request</li>
                  <li>Provide your project details and reason for the refund request</li>
                  <li>Include any supporting documentation or evidence</li>
                  <li>Allow us 5-7 business days to review your request</li>
                </ol>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">6.2 Review Process</h3>
                <p>
                  We will review your refund request and may request additional information or schedule a call to discuss the situation. We aim to resolve all refund requests fairly and promptly.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">6.3 Refund Timeline</h3>
                <p>
                  If your refund is approved:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You will receive a confirmation email within 2 business days</li>
                  <li>Refunds will be processed within 7-10 business days</li>
                  <li>Refunds will be issued to the original payment method</li>
                  <li>Bank processing times may vary (typically 5-10 business days)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Partial Refunds</h2>
                <p>
                  In some cases, we may issue partial refunds based on:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Percentage of work completed</li>
                  <li>Milestones achieved</li>
                  <li>Resources and time invested</li>
                  <li>Third-party costs incurred</li>
                </ul>
                <p className="mt-4">
                  Partial refund amounts will be calculated fairly based on the actual work completed versus the total project cost.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Non-Refundable Items</h2>
                <p>The following are non-refundable under all circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Third-party purchases (domains, SSL certificates, premium plugins/themes)</li>
                  <li>Hosting setup fees and initial hosting charges</li>
                  <li>Licensed software or tools purchased for your project</li>
                  <li>API access fees or third-party service subscriptions</li>
                  <li>Completed and delivered work that meets project specifications</li>
                  <li>Consultation fees</li>
                  <li>Rush delivery fees</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Dispute Resolution</h2>
                <p>
                  If you are dissatisfied with our refund decision, we encourage you to:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Contact us to discuss your concerns</li>
                  <li>Request a review by a senior team member</li>
                  <li>Provide additional documentation if available</li>
                </ol>
                <p className="mt-4">
                  We are committed to resolving disputes fairly and maintaining positive client relationships.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Maintenance and Support</h2>
                <p>
                  For ongoing maintenance and support contracts:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Monthly subscriptions can be cancelled with 30 days notice</li>
                  <li>No refunds for partial months</li>
                  <li>Prepaid support hours are non-refundable but remain available until expiration</li>
                  <li>Unused support hours do not roll over unless specified in your agreement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Special Circumstances</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">11.1 Force Majeure</h3>
                <p>
                  If project delays or cancellations are caused by events beyond our control (natural disasters, pandemics, government actions, etc.), refunds will be handled on a case-by-case basis.
                </p>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">11.2 Payment Disputes</h3>
                <p>
                  If you initiate a chargeback or payment dispute with your bank or credit card company without first contacting us, we reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Suspend all work immediately</li>
                  <li>Retain all completed work until the dispute is resolved</li>
                  <li>Terminate our service agreement</li>
                  <li>Seek legal remedies for fraudulent chargebacks</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Warranty Period</h2>
                <p>
                  We provide a 30-day warranty period for bug fixes on delivered work. During this period:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Bug fixes are provided free of charge</li>
                  <li>No refunds are issued for bugs that we fix within this period</li>
                  <li>Warranty does not cover changes to requirements or new features</li>
                  <li>Warranty is void if you or third parties modify the code</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Changes to This Policy</h2>
                <p>
                  We reserve the right to modify this Refund Policy at any time. Changes will be posted on our website with an updated effective date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
                <p className="mt-4">
                  Existing projects will be governed by the policy in effect at the time of project commencement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">14. Contact Us</h2>
                <p>
                  If you have questions about our Refund Policy or wish to request a refund, please contact us:
                </p>
                <div className="bg-gray-900/50 rounded-lg p-6 mt-4">
                  <p><strong className="text-white">Scythcode</strong></p>
                  <p>Email: <a href="mailto:dantethedev@gmail.com" className="text-cyan-400 hover:text-cyan-300">dantethedev@gmail.com</a></p>
                  <p>Website: <a href="/contact" className="text-cyan-400 hover:text-cyan-300">www.scythcode.com/contact</a></p>
                </div>
              </section>

              <section className="mt-12 pt-8 border-t border-gray-700">
                <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Our Commitment</h3>
                  <p className="text-sm text-gray-300">
                    At Scythcode, we believe in transparency and fairness. While we have policies in place, we evaluate each situation individually and strive to find solutions that work for everyone. Our goal is your satisfaction with every project we undertake.
                  </p>
                </div>
              </section>

              <section className="mt-8">
                <p className="text-sm text-gray-400">
                  By engaging Scythcode's services, you acknowledge that you have read, understood, and agree to this Refund Policy.
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
