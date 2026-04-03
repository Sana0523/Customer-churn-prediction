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

  // Mock Feature Importance Data (We will fetch the real one from the backend in Phase 7)
  const mockFeatureImportance = [
    { name: "Contract", value: 0.35 },
    { name: "Tenure", value: 0.22 },
    { name: "InternetService", value: 0.15 },
    { name: "TotalCharges", value: 0.10 },
    { name: "TechSupport", value: 0.08 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["tenure", "MonthlyCharges", "SeniorCitizen"].includes(name) ? Number(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary mocked UI response
    setPrediction({
      churn_prediction: formData.tenure > 20 ? "No" : "Yes",
      churn_probability: formData.tenure > 20 ? 0.25 : 0.85
    });
  };

  return (
    <div className="min-h-screen p-8 text-gray-800 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Customer Churn Predictor</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        
        {/* Left Side: Input Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex-1">
          <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Tenure (Months)</label>
              <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} 
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Monthly Charges ($)</label>
              <input type="number" step="0.01" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} 
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Total Charges ($)</label>
              <input type="text" name="TotalCharges" value={formData.TotalCharges} onChange={handleChange} 
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Contract Type</label>
              <select name="Contract" value={formData.Contract} onChange={handleChange} 
                 className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Internet Service</label>
              <select name="InternetService" value={formData.InternetService} onChange={handleChange} 
                 className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="DSL">DSL</option>
                <option value="Fiber optic">Fiber optic</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Payment Method</label>
              <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} 
                 className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Electronic check">Electronic check</option>
                <option value="Mailed check">Mailed check</option>
                <option value="Bank transfer (automatic)">Bank transfer</option>
                <option value="Credit card (automatic)">Credit card</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <button type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Predict Risk & Show Insights
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Dashboard & Visuals */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Prediction Result Panel */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
            {prediction ? (
              <div className="text-center w-full">
                <h2 className="text-2xl font-semibold mb-2">Confidence & Likelihood</h2>
                
                <div className={`mt-6 inline-flex items-center justify-center rounded-full h-32 w-32 border-8 shadow-sm ${prediction.churn_prediction === 'Yes' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
                  <span className={`text-3xl font-bold ${prediction.churn_prediction === 'Yes' ? 'text-red-600' : 'text-green-600'}`}>
                    {prediction.churn_prediction}
                  </span>
                </div>
                
                <p className="mt-6 text-gray-600 font-medium text-lg">
                  Churn Probability: <span className="font-bold text-gray-900">{(prediction.churn_probability * 100).toFixed(1)}%</span>
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${prediction.churn_prediction === 'Yes' ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${prediction.churn_probability * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="text-xl font-medium">Ready for Prediction</h2>
                <p className="mt-2 text-sm">Fill out the customer details and click predict to see the risk analysis and explainability chart.</p>
              </div>
            )}
          </div>

          {/* Model Insights / Feature Importance Panel */}
          {prediction && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex-1">
              <h3 className="text-lg font-semibold mb-4">Model Insights: Feature Importance</h3>
              <p className="text-sm text-gray-500 mb-6">This chart shows which customer traits most heavily influenced the AI's prediction.</p>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockFeatureImportance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
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
