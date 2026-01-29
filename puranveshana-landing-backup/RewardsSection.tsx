"use client";
import { BadgeIndianRupee, Check, X, Award } from 'lucide-react';

export function RewardsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-2 flex items-center justify-center gap-2">
           <div><BadgeIndianRupee className='text-yellow-600 h-14 w-14'/></div> Reward Highlights
          </h2>
          <div className="bg-linear-to-r from-orange-100 via-amber-100 to-orange-100 rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto mb-2 sm:mb-4 border-2 border-orange-200">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
             How Much Can You Earn?
            </h1>
            <p className="text-sm sm:text-base lg:text-lg font-semibold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Your discovery = Your reward. The rarer your find, the higher your payout.
            </p>
          </div>
        </div>

        <div id="rewards" className="mb-8 sm:mb-12 lg:mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 text-center px-2">Reward System</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <thead className="bg-linear-to-r from-orange-500 to-amber-600 text-white">
                  <tr>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm lg:text-base font-semibold">Type of Upload</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm lg:text-base font-semibold">Reward</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm lg:text-base font-semibold hidden md:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-orange-50 transition-colors">
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                        <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Unique + Verified</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-green-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">₹500-₹2000</td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                      Your original photo/video with GPS location — temples, statues, ruins, inscriptions. Every genuine discovery counts!
                    </td>
                  </tr>
                  <tr className="hover:bg-orange-50 transition-colors">
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                        <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Fake / Fraud</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-red-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">₹0</td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                      AI-generated, manipulated, or misleading content will result in account suspension. Authenticity is key.
                    </td>
                  </tr>
                  <tr className="hover:bg-orange-50 transition-colors bg-amber-50">
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                        <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Rare Find 🏆</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-amber-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">₹5000-₹20,000</td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                      Extraordinary finds — hidden temples, ancient inscriptions, rare idols, or undocumented archaeological sites. Make history!
                    </td>
                  </tr>
                  <tr className="hover:bg-orange-50 transition-colors bg-linear-to-r from-orange-50 to-amber-50">
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                        <span className="font-semibold text-slate-900 text-xs sm:text-sm lg:text-base">Monthly Heritage Award</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-orange-600 font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap">5x Bonus</td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm lg:text-base hidden md:table-cell">
                      Top monthly contributor gets 5x their total earnings! Be the best explorer and multiply your rewards.
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className='p-4 sm:p-5 lg:p-6 pb-2 sm:pb-3 lg:pb-4'>
                <div className='bg-linear-to-r from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 border-l-4 border-amber-500 shadow-sm'>
                  <p className='flex items-center gap-2 text-sm sm:text-base lg:text-lg font-semibold text-amber-700'>
                    <span className='text-xl sm:text-2xl'>✓</span>
                    All uploads are verified. Only genuine, unique discoveries are rewarded.
                  </p>
                </div>

                <div className="mt-4 bg-white rounded-xl p-5 shadow-md border border-orange-100 md:hidden">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-semibold text-green-600">Unique + Verified:</span>
                      <span className="text-slate-600"> Your original photo/video with GPS location — temples, statues, ruins, inscriptions. Every genuine discovery counts!</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-slate-500">Duplicate:</span>
                      <span className="text-slate-600"> Already exists on web</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-red-500">Fake/Fraud:</span>
                      <span className="text-slate-600"> AI-generated, manipulated, or misleading content will result in account suspension. Authenticity is key.</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-amber-600">Rare Find:</span>
                      <span className="text-slate-600"> Extraordinary finds — hidden temples, ancient inscriptions, rare idols, or undocumented archaeological sites. Make history!</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-orange-600">Monthly Heritage Award:</span>
                      <span className="text-slate-600"> Top monthly contributor gets 5x their total earnings! Be the best explorer and multiply your rewards.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
