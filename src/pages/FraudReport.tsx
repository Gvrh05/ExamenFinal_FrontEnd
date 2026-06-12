import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-cyber.jpg";

const API_URL = import.meta.env.VITE_API_URL;

interface FraudFormData {
  impostorDetails: string;
  contactInfo: string;
  comments: string;
}

const FraudReport = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

const form = useForm({
  defaultValues: {
    impostorDetails: "",
    contactInfo: "",
    comments: "",
  },
  onSubmit: async ({ value }) => {
    // Validación básica
    const newErrors: Record<string, string> = {};

    if (!value.impostorDetails?.trim()) {
      newErrors.impostorDetails = "Los detalles del impostor son obligatorios";
    }

    if (!value.contactInfo?.trim()) {
      newErrors.contactInfo = "El número, correo o usuario es obligatorio";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/fraud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          impostorDetails: value.impostorDetails,
          contactInfo: value.contactInfo,
          comments: value.comments || "",
        }),
      });

      if (response.ok) {
        setSuccessMessage("¡Reporte de fraude enviado exitosamente!");
        setErrors({});
        form.reset();
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        const error = await response.json();
        setSuccessMessage(null);
        setErrors({ general: error.message || "Error al enviar el reporte" });
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setSuccessMessage(null);
      setErrors({ general: "Error de conexión. ¿El backend está corriendo en https://localhost:7098?" });
    }
  }, 
}); 


  const handleFieldChange = (fieldName: keyof FraudFormData) => {
    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        id="main-content"
        className="relative flex-1 flex items-center justify-center overflow-hidden mt-20"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Content */}
        <section className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Reportar Fraude
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/90">
                Comparte los detalles de un intento de fraude o suplantación de identidad
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-300 font-medium">{successMessage}</p>
                  </div>
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="text-green-300 hover:text-green-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Form Card */}
            <Card className="border-primary-foreground/20 bg-background/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Formulario de Reporte</CardTitle>
                <CardDescription className="text-primary-foreground/70">
                  Por favor, proporcione los detalles relevantes sobre el incidente
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                  className="space-y-6"
                >
                  {/* Impostor Details Field */}
                  <div>
                    <label className="block text-sm font-medium text-primary-foreground mb-2">
                      Detalles del Impostor *
                    </label>
                    <form.Field
                      name="impostorDetails"
                      children={(field) => (
                        <div>
                          <input
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              handleFieldChange("impostorDetails");
                            }}
                            onBlur={field.handleBlur}
                            placeholder="Describe quién es el impostor, nombre, número, perfil, etc."
                            className={`w-full px-4 py-2 rounded-lg bg-primary-foreground/5 border backdrop-blur-sm text-primary-foreground placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                              errors.impostorDetails
                                ? "border-red-500 focus:ring-red-500"
                                : "border-primary-foreground/20 focus:border-primary-foreground/40 focus:ring-primary-foreground/50"
                            }`}
                          />
                          {errors.impostorDetails && (
                            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.impostorDetails}</span>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Contact Info Field */}
                  <div>
                    <label className="block text-sm font-medium text-primary-foreground mb-2">
                      Número, Correo o Usuario *
                    </label>
                    <form.Field
                      name="contactInfo"
                      children={(field) => (
                        <div>
                          <input
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              handleFieldChange("contactInfo");
                            }}
                            onBlur={field.handleBlur}
                            placeholder="El número de teléfono, correo o usuario desde el que contactó"
                            className={`w-full px-4 py-2 rounded-lg bg-primary-foreground/5 border backdrop-blur-sm text-primary-foreground placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                              errors.contactInfo
                                ? "border-red-500 focus:ring-red-500"
                                : "border-primary-foreground/20 focus:border-primary-foreground/40 focus:ring-primary-foreground/50"
                            }`}
                          />
                          {errors.contactInfo && (
                            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.contactInfo}</span>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Comments Field */}
                  <div>
                    <label className="block text-sm font-medium text-primary-foreground mb-2">
                      Comentarios (Opcional)
                    </label>
                    <form.Field
                      name="comments"
                      children={(field) => (
                        <textarea
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            handleFieldChange("comments");
                          }}
                          onBlur={field.handleBlur}
                          placeholder="Información adicional sobre el incidente..."
                          rows={5}
                          className="w-full px-4 py-2 rounded-lg bg-primary-foreground/5 border border-primary-foreground/20 backdrop-blur-sm text-primary-foreground placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary-foreground/40 transition-all resize-none"
                        />
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all hover:scale-105"
                    >
                      Reportar Fraude
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        form.reset();
                        setErrors({});
                        setSuccessMessage(null);
                      }}
                      className="flex-1 bg-black text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      Limpiar
                    </Button>
                  </div>

                  {/* Help Text */}
                  <p className="text-xs text-primary-foreground/60 text-center pt-4">
                    Los campos marcados con * son obligatorios
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Info Section */}
            <div className="mt-12 p-6 rounded-lg bg-primary-foreground/5 border border-primary-foreground/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <h3 className="text-lg font-semibold text-primary-foreground mb-3">
                ¿Necesita ayuda?
              </h3>
              <p className="text-primary-foreground/80 mb-4">
                Si tiene dudas o requiere asistencia adicional, contacte al laboratorio:
              </p>
              <a
                href="mailto:labcibe@una.ac.cr"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                labcibe@una.ac.cr
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FraudReport;
