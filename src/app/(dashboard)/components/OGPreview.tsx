"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ExternalLink, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface OGPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export default function OGPreview({
  title,
  description,
  imageUrl,
  url,
}: OGPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Debug logs para verificar
  console.log("OGPreview - NODE_ENV:", process.env.NODE_ENV);
  console.log("OGPreview - Props:", { title, description, imageUrl, url });

  // Solo mostrar en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!isDevelopment) {
    console.warn(
      "OGPreview component should only be used in development mode for testing Open Graph previews."
    );
    return null;
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Preview OG
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-orange-200 dark:border-orange-800 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
              >
                🚧 DEV MODE
              </Badge>
              <CardTitle className="text-sm">Open Graph Preview</CardTitle>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <EyeOff className="w-3 h-3" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Así se verá al compartir el link en redes sociales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Preview Card */}
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            {/* OG Image */}
            <div className="relative bg-gray-100 dark:bg-gray-700 h-32">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                </div>
              )}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="text-xs text-center px-2">
                    Error cargando imagen
                  </div>
                  <div className="text-xs text-center px-2 mt-1 font-mono break-all">
                    {imageUrl}
                  </div>
                </div>
              )}
              <img
                src={imageUrl}
                alt="Open Graph Preview"
                className="w-full h-full object-cover"
                onLoad={() => {
                  console.log("Image loaded successfully:", imageUrl);
                  setImageLoaded(true);
                  setImageError(false);
                }}
                onError={(e) => {
                  console.error("Error loading image:", imageUrl, e);
                  setImageLoaded(true);
                  setImageError(true);
                }}
                style={{ display: imageError ? "none" : "block" }}
              />
            </div>

            {/* Content */}
            <div className="p-3 space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {url
                  ? (() => {
                      try {
                        return new URL(url).hostname;
                      } catch {
                        return "localhost:5200";
                      }
                    })()
                  : "localhost:5200"}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                {title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => window.open(imageUrl, "_blank")}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Ver Imagen
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url);
                // Aquí podrías agregar un toast notification
                console.log("URL copied to clipboard:", url);
              }}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              📋 Copiar URL
            </Button>
          </div>

          {/* Test button for direct API call */}
          <Button
            onClick={() => {
              const testUrl = `${window.location.origin}${imageUrl}`;
              console.log("Testing image URL:", testUrl);
              window.open(testUrl, "_blank");
            }}
            variant="secondary"
            size="sm"
            className="w-full text-xs"
          >
            🧪 Probar API directamente
          </Button>

          {/* Debug Info */}
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Debug Info
            </summary>
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs font-mono space-y-1">
              <div>
                <strong>Title:</strong> {title}
              </div>
              <div>
                <strong>Description:</strong> {description}
              </div>
              <div>
                <strong>Image URL:</strong>{" "}
                <a
                  href={imageUrl}
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {imageUrl}
                </a>
              </div>
              <div>
                <strong>Page URL:</strong> {url}
              </div>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
