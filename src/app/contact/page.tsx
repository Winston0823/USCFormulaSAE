"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Instagram,
  Linkedin,
  Twitter,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#8b0000]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#d9c26b]/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#d9c26b]/10 text-[#d9c26b] text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4 mr-2" />
              GET IN TOUCH
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Contact <span className="text-[#d9c26b]">Us</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Have questions about joining the team, sponsoring us, or anything else?
              We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Get in Touch</h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#d9c26b]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#d9c26b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
                    <p className="text-gray-400">
                      University of Southern California<br />
                      3650 McClintock Ave<br />
                      Los Angeles, CA 90089
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#d9c26b]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#d9c26b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <a href="mailto:fsae@usc.edu" className="text-gray-400 hover:text-[#d9c26b] transition-colors">
                      fsae@usc.edu
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#d9c26b]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#d9c26b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Workshop Hours</h3>
                    <p className="text-gray-400">
                      Monday - Friday: 4:00 PM - 10:00 PM<br />
                      Saturday: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 rounded-xl bg-white/5 border border-[#d9c26b]/20 flex items-center justify-center text-gray-400 hover:text-[#d9c26b] hover:border-[#d9c26b]/50 transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-xl bg-white/5 border border-[#d9c26b]/20 flex items-center justify-center text-gray-400 hover:text-[#d9c26b] hover:border-[#d9c26b]/50 transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-xl bg-white/5 border border-[#d9c26b]/20 flex items-center justify-center text-gray-400 hover:text-[#d9c26b] hover:border-[#d9c26b]/50 transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-12">
                <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-black border border-[#d9c26b]/20 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#d9c26b]/20 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-[#d9c26b]" />
                      </div>
                      <p className="text-gray-500 text-sm">Map Placeholder</p>
                      <p className="text-gray-600 text-xs mt-1">USC Campus Location</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-8 rounded-2xl bg-white/5 border border-[#d9c26b]/20 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-2">Send a Message</h2>
                <p className="text-gray-400 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400">We&apos;ll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#d9c26b]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#d9c26b]/50 focus:ring-1 focus:ring-[#d9c26b]/50 transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#d9c26b]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#d9c26b]/50 focus:ring-1 focus:ring-[#d9c26b]/50 transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#d9c26b]/20 text-white focus:outline-none focus:border-[#d9c26b]/50 focus:ring-1 focus:ring-[#d9c26b]/50 transition-all"
                      >
                        <option value="" className="bg-black">Select a subject</option>
                        <option value="joining" className="bg-black">Joining the Team</option>
                        <option value="sponsorship" className="bg-black">Sponsorship Inquiry</option>
                        <option value="media" className="bg-black">Media Inquiry</option>
                        <option value="other" className="bg-black">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#d9c26b]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#d9c26b]/50 focus:ring-1 focus:ring-[#d9c26b]/50 transition-all resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-8 py-4 bg-[#d9c26b] rounded-xl text-black font-bold text-lg hover:bg-[#c4ae5a] hover:shadow-lg hover:shadow-[#d9c26b]/30 transition-all duration-300 neon-button"
                    >
                      Send Message
                      <Send className="w-5 h-5 ml-2" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="text-[#d9c26b]">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Do I need prior experience to join?",
                a: "Not at all! We welcome students of all experience levels. We provide training and mentorship to help you develop the skills you need.",
              },
              {
                q: "What majors can join the team?",
                a: "Any major is welcome! While many of our members study engineering, we also have students from business, computer science, design, and other fields.",
              },
              {
                q: "How much time commitment is required?",
                a: "We typically ask for 5-10 hours per week, but this can vary based on your role and the competition schedule. We're flexible with academic commitments.",
              },
              {
                q: "How can my company sponsor the team?",
                a: "We'd love to discuss sponsorship opportunities! Please fill out the contact form above or email us directly at fsae@usc.edu.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-[#d9c26b]/20"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
