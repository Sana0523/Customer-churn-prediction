// frontend/src/App.jsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [formData, setFormData] = useState({
    gender: "Female",
    SeniorCitizen: 0,
    Partner: "Yes",
    Dependents: "No",
    tenure: 12,
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "Fiber optic",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "Yes",
    StreamingMovies: "No",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    MonthlyCharges: 85.5,
    TotalCharges: "1026.0"
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockFeatureImportance = [
    { name: "Contract", value: 0.35 },
    { name: "Tenure", value: 0.22 },
    { name: "Internet", value: 0.15 },
    { name: "TotalCharges", value: 0.10 },
    { name: "MonthlyCharges", value: 0.08 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["tenure", "MonthlyCharges", "SeniorCitizen"].includes(name) ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          TotalCharges: String(formData.TotalCharges) 
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend API limit. Ensure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all shadow-inner";
  const labelClasses = "text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider block";

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3 tracking-tight">
          Customer Pulse AI
        </h1>
        <p className="text-slate-400 font-medium">Predicting retention with deep machine learning insights</p>
      </div>
      
      {error && (
        <div className="w-full max-w-7xl bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8 w-full max-w-7xl">
        
        {/* Left Side: Input Form */}
        <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/50 flex-[1.2]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Customer Profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            
            <div>
              <label className={labelClasses}>Tenure (Months)</label>
              <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
              <label className={labelClasses}>Monthly Charges ($)</label>
              <input type="number" step="0.01" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
              <label className={labelClasses}>Total Charges ($)</label>
              <input type="text" name="TotalCharges" value={formData.TotalCharges} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
              <label className={labelClasses}>Contract Type</label>
              <select name="Contract" value={formData.Contract} onChange={handleChange} className={inputClasses}>
                <option className="bg-slate-800 text-slate-200" value="Month-to-month">Month-to-month</option>
                <option className="bg-slate-800 text-slate-200" value="One year">One year</option>
                <option className="bg-slate-800 text-slate-200" value="Two year">Two year</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Internet Service</label>
              <select name="InternetService" value={formData.InternetService} onChange={handleChange} className={inputClasses}>
                <option className="bg-slate-800 text-slate-200" value="DSL">DSL</option>
                <option className="bg-slate-800 text-slate-200" value="Fiber optic">Fiber optic</option>
                <option className="bg-slate-800 text-slate-200" value="No">No</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Payment Method</label>
              <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} className={inputClasses}>
                <option className="bg-slate-800 text-slate-200" value="Electronic check">Electronic check</option>
                <option className="bg-slate-800 text-slate-200" value="Mailed check">Mailed check</option>
                <option className="bg-slate-800 text-slate-200" value="Bank transfer (automatic)">Bank transfer</option>
                <option className="bg-slate-800 text-slate-200" value="Credit card (automatic)">Credit card</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 mt-6">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]'} text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 flex justify-center items-center text-lg shadow-xl`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Analyzing Profile...
                  </span>
                ) : (
                  "Analyze Risk & Generate Insights"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Dashboard & Visuals */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
            
            {/* Background Glow */}
            {prediction && (
               <div className={`absolute -inset-10 opacity-20 blur-[100px] transition-all duration-1000 ${prediction.churn_prediction === 'Yes' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            )}

            <div className="relative z-10 w-full flex flex-col items-center">
              {prediction ? (
                <>
                  <h2 className="text-xl font-semibold text-slate-300 mb-6 uppercase tracking-widest">Risk Assessment</h2>
                  
                  <div className={`relative inline-flex items-center justify-center rounded-full h-40 w-40 border-[6px] shadow-2xl ${prediction.churn_prediction === 'Yes' ? 'border-rose-500/50 bg-rose-500/10 shadow-rose-500/20' : 'border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/20'}`}>
                    <span className={`text-4xl font-extrabold ${prediction.churn_prediction === 'Yes' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {prediction.churn_prediction}
                    </span>
                  </div>
                  
                  <div className="mt-8 text-center w-full max-w-sm">
                    <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
                      <span>Retention Likelihood</span>
                      <span>Churn Score</span>
                    </div>
                    
                    <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-700 shadow-inner block">
                       {/* Flipped logic because higher probability means higher churn chance */}
                      <div 
                        className={`h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${prediction.churn_prediction === 'Yes' ? 'from-rose-600 to-rose-400' : 'from-emerald-600 to-emerald-400'}`} 
                        style={{ width: `${prediction.churn_probability * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-3 font-mono text-xl text-slate-200">
                      {(prediction.churn_probability * 100).toFixed(1)}<span className="text-slate-500 text-lg">%</span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-500 flex flex-col items-center py-8">
                  <div className="w-20 h-20 mb-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700/50">
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  <h2 className="text-xl font-medium text-slate-300 mb-2">Awaiting Data</h2>
                  <p className="text-sm max-w-xs">Enter customer details and initialize the prediction engine to generate insights.</p>
                </div>
              )}
            </div>
          </div>

          {prediction && (
            <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/50 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-200 mb-1">Feature Importance Matrix</h3>
                <p className="text-xs text-slate-400">Global significance of traits determining the model output.</p>
              </div>
              
              <div className="h-56 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockFeatureImportance} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={{stroke: '#334155'}} tickLine={false} />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#cbd5e1'}} stroke="#64748b" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} />
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
