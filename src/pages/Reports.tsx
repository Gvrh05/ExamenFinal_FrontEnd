import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-cyber.jpg";

const API_URL = import.meta.env.VITE_API_URL;

interface Fraud {
  id: number;
  impostorDetails: string;
  contactInfo: string;
  comments: string;
  createdAt: string;
}

type LoadingState = "idle" | "loading" | "success" | "error";

const Reports = () => {
  const [reports, setReports] = useState<Fraud[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoadingState("loading");
        setErrorMessage(null);

        const response = await fetch(`${API_URL}/fraud`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setReports(Array.isArray(data) ? data : []);
        setLoadingState("success");
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Error al cargar los reportes. Por favor, intente de nuevo.";
        setErrorMessage(errorMsg);
        setLoadingState("error");
        console.error("Error al cargar reportes:", error);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-CR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
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
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Reportes de Fraude
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/90">
                Listado de todos los reportes de fraude registrados en el sistema
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <Link to="/reportar-estafa">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-all hover:scale-105">
                  Nuevo Reporte
                </Button>
              </Link>
            </div>

            {/* Loading State */}
            {loadingState === "loading" && (
              <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col items-center gap-4">
                  <Loader className="w-12 h-12 text-primary-foreground animate-spin" />
                  <p className="text-lg text-primary-foreground/90">Cargando reportes...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {loadingState === "error" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3 px-6 py-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm mb-8">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-300 font-medium">{errorMessage}</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-all"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            )}

            {/* Success State - Empty */}
            {loadingState === "success" && reports.length === 0 && (
              <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-foreground/70" />
                </div>
                <p className="text-lg text-primary-foreground/90 mb-4">
                  No hay reportes registrados aún
                </p>
                <p className="text-primary-foreground/70 mb-6">
                  Sé el primero en reportar un caso de fraude
                </p>
              </div>
            )}

            {/* Success State - With Reports */}
            {loadingState === "success" && reports.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm">
                  <p className="text-green-300 font-medium">
                    ✓ Se cargaron {reports.length} reporte{reports.length !== 1 ? "s" : ""} exitosamente
                  </p>
                </div>

                {reports.map((report, index) => (
                  <Card
                    key={report.id}
                    className="border-primary-foreground/20 bg-background/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 transition-all"
                    style={{
                      animationDelay: `${(index + 1) * 50}ms`,
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-primary-foreground flex items-center gap-2">
                            <span className="text-sm font-medium bg-primary-foreground/20 px-3 py-1 rounded-full">
                              #{report.id}
                            </span>
                            Detalles del Impostor
                          </CardTitle>
                          <CardDescription className="text-primary-foreground/70 mt-2">
                            Registrado: {formatDate(report.createdAt)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Impostor Details */}
                      <div>
                        <label className="block text-sm font-medium text-primary-foreground mb-2">
                          Detalles del Impostor
                        </label>
                        <p className="text-primary-foreground/90 p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
                          {report.impostorDetails}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <label className="block text-sm font-medium text-primary-foreground mb-2">
                          Contacto
                        </label>
                        <p className="text-primary-foreground/90 p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 font-mono text-sm">
                          {report.contactInfo}
                        </p>
                      </div>

                      {/* Comments */}
                      {report.comments && (
                        <div>
                          <label className="block text-sm font-medium text-primary-foreground mb-2">
                            Comentarios
                          </label>
                          <p className="text-primary-foreground/90 p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
                            {report.comments}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
