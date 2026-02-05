"use client";
import { useState, useEffect } from 'react';
import { Camera, MapPin, Check, Upload, Play, BarChart3, Lock, Mail, LogIn, Mountain, Building2, Scroll, Landmark, Eye, EyeOff } from 'lucide-react';

export default function AppDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [uploadTitle, setUploadTitle] = useState('');

  const steps = [
    { id: 'login', label: 'Login' },
    { id: 'upload', label: 'Upload' },
    { id: 'complete', label: 'Complete' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  const getUrlForStep = (stepId: string) => {
    switch (stepId) {
      case 'login': return 'puranveshana.com/login';
      case 'dashboard': return 'puranveshana.com/dashboard';
      case 'upload': return 'puranveshana.com/dashboard';
      case 'complete': return 'puranveshana.com/dashboard';
      default: return 'puranveshana.com';
    }
  };

  useEffect(() => {
    if (currentStep !== 0) return;

    const targetEmail = 'explorer@gmail.com';
    const targetPassword = '••••••••';
    let emailIndex = 0;
    let passwordIndex = 0;
    let phase = 'email';

    const timer = setInterval(() => {
      if (phase === 'email') {
        if (emailIndex < targetEmail.length) {
          setLoginEmail(targetEmail.slice(0, emailIndex + 1));
          emailIndex++;
        } else {
          phase = 'password';
        }
      } else if (phase === 'password') {
        if (passwordIndex < targetPassword.length) {
          setLoginPassword(targetPassword.slice(0, passwordIndex + 1));
          passwordIndex++;
        }
      }
    }, 80);

    return () => clearInterval(timer);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 1) return;

    const targetTitle = 'Hidden Temple in Forest...';
    let titleIndex = 0;

    const timer = setInterval(() => {
      if (titleIndex < targetTitle.length) {
        setUploadTitle(targetTitle.slice(0, titleIndex + 1));
        titleIndex++;
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentStep]);

  useEffect(() => {
    setLoginEmail('');
    setLoginPassword('');
    setUploadTitle('');
  }, [currentStep]);

  useEffect(() => {
    if (!isPlaying) return;

    const delay = currentStep === 0 ? 2500 : 4000;

    const timeout = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isPlaying, steps.length, currentStep]);

  return (
    <div className="relative w-full max-w-4xl mx-auto z-10">
      <div className="bg-slate-800 rounded-t-xl p-2 sm:p-3 flex items-center gap-2">
        <div className="flex gap-1 sm:gap-1.5">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 bg-slate-700 rounded-md px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-slate-300 ml-1 sm:ml-2 truncate">
          {getUrlForStep(steps[currentStep].id)}
        </div>
      </div>

      <div className="bg-amber-50 rounded-b-xl shadow-2xl overflow-hidden border border-slate-200 border-t-0">
        <div className="min-h-[350px] sm:min-h-[400px] md:min-h-[450px] relative overflow-hidden">

          <div className={`transition-all duration-500 absolute inset-0 ${currentStep === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="bg-linear-to-br from-amber-50 via-orange-50 to-white h-full flex items-center justify-center p-3 sm:p-4 md:p-6">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-orange-100 w-full max-w-xs sm:max-w-sm">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent notranslate" translate="no">Puranveshana</span>
                    <span className="text-[8px] sm:text-[10px] text-orange-500 -mt-0.5 notranslate" translate="no">पुरातन अन्वेषण</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-center text-slate-900 mb-1 sm:mb-2">Welcome Back</h2>
                <p className="text-[10px] sm:text-xs text-center text-slate-500 mb-4 sm:mb-6">Sign in to continue exploring</p>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-1 block">Email</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
                      <div className="bg-slate-50 border-2 border-orange-200 rounded-lg pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 text-[10px] sm:text-xs text-slate-700 min-h-9 sm:min-h-10">
                        {loginEmail}<span className={`${loginEmail.length < 17 ? 'animate-pulse' : 'opacity-0'} text-orange-500`}>|</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
                      <div className="bg-slate-50 border-2 border-orange-200 rounded-lg pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 text-[10px] sm:text-xs text-slate-700 min-h-9 sm:min-h-10">
                        {showLoginPassword ? 'password123' : loginPassword}<span className={`${loginPassword.length < 8 && loginEmail.length >= 17 ? 'animate-pulse' : 'opacity-0'} text-orange-500`}>|</span>
                      </div>
                      <button
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                      >
                        {showLoginPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                  </div>
                  <button className="w-full bg-linear-to-r from-orange-500 to-amber-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all">
                    <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Sign In
                  </button>
                </div>

                <p className="text-[10px] sm:text-xs text-center text-slate-500 mt-3 sm:mt-4">
                  Don&apos;t have an account? <span className="text-orange-600 font-semibold cursor-pointer hover:underline">Sign up</span>
                </p>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 absolute inset-0 ${currentStep === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-bold text-orange-600 text-xs sm:text-sm notranslate" translate="no">Puranveshana</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs text-slate-600 hidden sm:block">explorer@gmail.com</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs text-orange-600 font-bold">E</span>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-slate-100">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  Upload Heritage Site
                </h3>

                <div className="border-2 border-dashed border-orange-300 rounded-xl p-3 sm:p-4 md:p-6 text-center mb-3 sm:mb-4 bg-orange-50">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 animate-bounce">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 mb-0.5 sm:mb-1">Drag & drop your images here</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400">or click to browse</p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="text-[10px] sm:text-xs font-medium text-slate-700 mb-1 block">Title</label>
                    <div className="bg-slate-50 border-2 border-orange-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm text-slate-700 min-h-8 sm:min-h-9">
                      {uploadTitle}<span className={`${uploadTitle.length < 25 ? 'animate-pulse' : 'opacity-0'} text-orange-500`}>|</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-medium text-slate-700 mb-1 block">Location</label>
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm flex items-center gap-1.5 sm:gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-green-700 font-medium">GPS Location Auto-detected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 absolute inset-0 ${currentStep === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-bold text-orange-600 text-xs sm:text-sm notranslate" translate="no">Puranveshana</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs text-slate-600 hidden sm:block">explorer@gmail.com</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs text-orange-600 font-bold">E</span>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-slate-100 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce shadow-lg">
                  <Check className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Upload Successful!</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 mb-3 sm:mb-4">Your heritage site has been verified and added.</p>

                <div className="bg-linear-to-br from-amber-100 to-orange-100 rounded-xl p-3 sm:p-4 border-2 border-amber-300 mb-3 sm:mb-4">
                  <p className="text-[10px] sm:text-xs text-amber-700 font-semibold mb-0.5 sm:mb-1">Estimated Reward</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">₹50 - ₹200</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-amber-600 mt-0.5 sm:mt-1">Unique & Verified Discovery</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-2 sm:p-3 text-left border border-slate-200">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center shrink-0">
                      <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h4 className="font-semibold text-[10px] sm:text-xs md:text-sm text-slate-900">Hidden Temple</h4>
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      </div>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500">Karnataka</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 absolute inset-0 ${currentStep === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-bold text-orange-600 text-xs sm:text-sm notranslate" translate="no">Puranveshana</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs text-slate-600 hidden sm:block">explorer@gmail.com</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs text-orange-600 font-bold">E</span>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                <div className="bg-linear-to-br from-orange-500 to-amber-600 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white shadow-lg">
                  <div className="text-base sm:text-lg md:text-2xl font-bold">13</div>
                  <div className="text-[8px] sm:text-[10px] md:text-xs opacity-90">Sites Found</div>
                </div>
                <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white shadow-lg">
                  <div className="text-base sm:text-lg md:text-2xl font-bold">9</div>
                  <div className="text-[8px] sm:text-[10px] md:text-xs opacity-90">Verified</div>
                </div>
                <div className="bg-linear-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white shadow-lg">
                  <div className="text-base sm:text-lg md:text-2xl font-bold">25</div>
                  <div className="text-[8px] sm:text-[10px] md:text-xs opacity-90">Images</div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5 sm:gap-2">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Your Heritage Sites
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer">
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <h4 className="font-semibold text-[10px] sm:text-xs text-slate-900 truncate">Ancient Temple</h4>
                          <Check className="w-3 h-3 text-green-500 shrink-0" />
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500">Karnataka</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-orange-500" />
                          <span className="text-[8px] text-slate-400">12.9716°, 77.5946°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                        <Scroll className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <h4 className="font-semibold text-[10px] sm:text-xs text-slate-900 truncate">Stone Inscription</h4>
                          <Check className="w-3 h-3 text-green-500 shrink-0" />
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500">Tamil Nadu</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-orange-500" />
                          <span className="text-[8px] text-slate-400">13.0827°, 80.2707°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md border border-slate-100 hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer">
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <h4 className="font-semibold text-[10px] sm:text-xs text-slate-900 truncate">Ancient Fort Ruins</h4>
                          <Check className="w-3 h-3 text-green-500 shrink-0" />
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500">Rajasthan</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-orange-500" />
                          <span className="text-[8px] text-slate-400">26.9124°, 75.7873°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer">
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <Mountain className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <h4 className="font-semibold text-[10px] sm:text-xs text-slate-900 truncate">Hidden Temple</h4>
                          <Check className="w-3 h-3 text-green-500 shrink-0" />
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500">Karnataka</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-orange-500" />
                          <span className="text-[8px] text-slate-400">13.1234°, 77.6789°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 sm:px-4 pb-3 sm:pb-4 flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs transition-all ${
                idx === currentStep
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {idx === currentStep && <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></span>}
              <span className="hidden xs:inline sm:inline">{step.label}</span>
              <span className="xs:hidden sm:hidden">{idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-11 sm:top-12 md:top-14 right-2 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-white transition-colors z-20"
        aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
      >
        {isPlaying ? (
          <div className="flex gap-0.5">
            <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 md:h-3 bg-white rounded-sm"></div>
            <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 md:h-3 bg-white rounded-sm"></div>
          </div>
        ) : (
          <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5" />
        )}
      </button>
    </div>
  );
}
