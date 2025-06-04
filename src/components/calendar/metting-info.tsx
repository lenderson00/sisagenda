"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

interface MeetingInfoProps {
  profileName?: string;
  duration?: number;
  profileImage?: string;
}

export function MeetingInfo({
  profileName = "Antoine Milkoff",
  duration = 30,
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
      <div className="flex-shrink-0 ">
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
      </div>

      {/* Meeting Details */}
      <div className="flex-1 space-y-4">
        <div className=" border-slate-100 pt-4">
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
