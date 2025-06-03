"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown, Clock, Globe, User, Video } from "lucide-react";

interface MeetingInfoProps {
  profileName?: string;
  meetingTitle?: string;
  duration?: number;
  videoEnabled?: boolean;
  timezone?: string;
  profileImage?: string;
}

export function MeetingInfo({
  profileName = "Antoine Milkoff",
  meetingTitle = "30 Min Meeting",
  duration = 30,
  videoEnabled = true,
  profileImage,
}: MeetingInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-white flex flex-col p-6"
    >
      {/* Profile Section */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage || "/placeholder.svg"}
                alt={profileName}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h2 className="font-medium text-slate-900">{profileName}</h2>
            <p className="text-sm text-slate-500">Disponível</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Meeting Title */}
          <div>
            <h3 className="font-semibold text-lg text-slate-900 mb-1">
              {meetingTitle}
            </h3>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{duration} mins</span>
          </div>

          {/* Video Option */}
          {videoEnabled && (
            <div className="flex items-center gap-2 text-slate-600">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Cal Video</span>
            </div>
          )}
        </div>
      </div>

      {/* Meeting Details */}
      <div className="flex-1 space-y-4">
        <div className="border-t border-slate-100 pt-4">
          <h4 className="font-medium text-slate-900 mb-3">
            Detalhes da Entrega
          </h4>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Duração:</span>
              <span className="font-medium">{duration} minutos</span>
            </div>
            <div className="flex justify-between">
              <span>Endereço:</span>
              <span className="font-medium">Rua das Flores, 123</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h4 className="font-medium text-slate-900 mb-3">Sobre a Entrega</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Entrega de 30 minutos de materiais simples.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">
          Powered by SisAgenda
        </p>
      </div>
    </motion.div>
  );
}
