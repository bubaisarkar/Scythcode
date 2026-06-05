import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - Scythcode',
  description: 'Learn how Scythcode collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400 mb-8">Effective Date: June 5, 2026</p>

            <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
                <p>
                  Welcome to Scythcode ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">2.1 Personal Information</h3>
                <p>We may collect the following personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and email address (when you sign up or contact us)</li>
                  <li>Authentication information (via Google or GitHub OAuth)</li>
                  <li>Profile information (display name, avatar, username)</li>
                  <li>Project details and requirements (when you request a service)</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Communication history (messages, chat transcripts)</li>
                </ul>

                <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-3">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your project requests and deliver services</li>
                  <li>Communicate with you about projects, updates, and support</li>
                  <li>Authenticate your account and prevent fraud</li>
                  <li>Analyze usage patterns and optimize user experience</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce our agreements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Firebase Authentication</h2>
                <p>
                  We use Firebase Authentication by Google to manage user accounts. When you sign in with Google or GitHub, Firebase collects and processes your authentication data. This data is stored securely in accordance with Google's privacy practices and is subject to Google's Privacy Policy.
                </p>
                <p className="mt-4">
                  We do not store your passwords. Authentication is handled entirely by Firebase and your chosen OAuth provider.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. How We Share Your Information</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business (hosting, analytics, payment processing)</li>
                  <li><strong>Authentication Providers:</strong> Google, GitHub (for OAuth authentication)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
                <p className="mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze traffic, and personalize content. You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
                </p>
                <p className="mt-4">Types of cookies we use:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential:</strong> Required for authentication and basic functionality</li>
                  <li><strong>Analytics:</strong> Help us understand how you use our website</li>
                  <li><strong>Functional:</strong> Remember your preferences and settings</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure authentication via Firebase</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Encrypted data storage</li>
                </ul>
                <p className="mt-4">
                  However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Your Privacy Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Object:</strong> Object to certain processing activities</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at: <a href="mailto:dantethedev@gmail.com" className="text-cyan-400 hover:text-cyan-300 underline">dantethedev@gmail.com</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Data Retention</h2>
                <p>
                  We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete or anonymize your personal information within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Children's Privacy</h2>
                <p>
                  Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Effective Date." Your continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">14. Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-900/50 rounded-lg p-6 mt-4">
                  <p><strong className="text-white">Scythcode</strong></p>
                  <p>Email: <a href="mailto:dantethedev@gmail.com" className="text-cyan-400 hover:text-cyan-300">dantethedev@gmail.com</a></p>
                  <p>Website: <a href="/contact" className="text-cyan-400 hover:text-cyan-300">www.scythcode.com/contact</a></p>
                </div>
              </section>

              <section className="mt-12 pt-8 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  By using Scythcode's services, you acknowledge that you have read and understood this Privacy Policy.
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
