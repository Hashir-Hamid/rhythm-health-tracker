
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SearchIcon, HeartPulse, AlertCircle } from "lucide-react";
import { SymptomCheckRequest, ConditionResult, checkSymptoms } from "@/services/symptomService";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

interface SymptomFormData {
  symptoms: string;
  age: number;
  gender: "male" | "female";
}

const SymptomChecker = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ConditionResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SymptomFormData>({
    defaultValues: {
      symptoms: "",
      age: 30,
      gender: "male",
    },
  });

  const onSubmit = async (data: SymptomFormData) => {
    try {
      setIsLoading(true);
      setShowResults(false);
      setMessage(null);
      
      // Parse symptoms into array
      const symptomsList = data.symptoms
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (symptomsList.length === 0) {
        setMessage("Please enter at least one symptom");
        setIsLoading(false);
        return;
      }

      const request: SymptomCheckRequest = {
        symptoms: symptomsList,
        age: data.age,
        gender: data.gender,
      };

      const response = await checkSymptoms(request);
      setResults(response.conditions);
      
      if (response.message) {
        setMessage(response.message);
      }
      
      setShowResults(true);
    } catch (error) {
      console.error("Error checking symptoms:", error);
      setMessage("An error occurred while checking symptoms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Symptom Checker</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Enter your symptoms to get possible causes and recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Enter Your Symptoms
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symptoms (comma separated)
                </label>
                <div className="relative">
                  <input
                    id="symptoms"
                    type="text"
                    placeholder="headache, fever, cough, etc."
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-purple focus:border-health-purple"
                    {...register("symptoms", { required: "Please enter your symptoms" })}
                  />
                  <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.symptoms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.symptoms.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Example: headache, fever, fatigue
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-purple focus:border-health-purple"
                    {...register("age", { 
                      required: "Age is required",
                      min: { value: 0, message: "Age must be positive" },
                      max: { value: 120, message: "Age must be less than 120" },
                    })}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                      {errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-purple focus:border-health-purple"
                    {...register("gender")}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-health-purple hover:bg-health-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-health-purple disabled:opacity-50"
                >
                  {isLoading ? "Checking..." : "Check Symptoms"}
                </button>
              </div>
            </form>
            
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="inline-block h-4 w-4 mr-1" />
                Disclaimer: This tool provides information for educational purposes only and is not a substitute for medical advice.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-8 flex justify-center">
              <div className="text-center">
                <LoadingSpinner size="large" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Analyzing your symptoms...
                </p>
              </div>
            </div>
          ) : showResults ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <HeartPulse className="h-5 w-5 mr-2 text-health-purple" />
                  Possible Conditions
                </h2>
              </div>
              
              {message && (
                <div className="p-6 border-b bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  <p>{message}</p>
                </div>
              )}
              
              {results.length > 0 ? (
                <div className="divide-y">
                  {results.map((condition) => (
                    <div key={condition.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {condition.common_name || condition.name}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-health-purple/10 text-health-purple">
                          {condition.probability}% match
                        </span>
                      </div>
                      
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {condition.description}
                      </p>
                      
                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Recommended Action:
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          {condition.recommendedAction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !message && (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No conditions found that match your symptoms.
                  </div>
                )
              )}
              
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remember that online symptom checkers are not a substitute for professional medical advice. If you're concerned about your symptoms, please consult a healthcare provider.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-8 flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-health-purple/10 mb-4">
                  <HeartPulse className="h-8 w-8 text-health-purple" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Enter your symptoms
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Fill out the form to get possible causes for your symptoms.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
