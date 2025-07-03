"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/dialog-drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { SupplierForm } from "./supplier-form";
import { useSearchSupplierByCnpj } from "../_hooks/supplier-queries";
import { useAssociateSupplier } from "../_hooks/supplier-mutations";

interface SearchSupplierDialogProps {
  orgId: string;
}

// CNPJ mask function
function applyCnpjMask(value: string): string {
  // Remove all non-digits
  const numbers = value.replace(/\D/g, "");

  // Apply CNPJ mask: XX.XXX.XXX/XXXX-XX
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
}

// Function to remove mask for API calls
function removeCnpjMask(value: string): string {
  return value.replace(/\D/g, "");
}

export function SearchSupplierDialog({ orgId }: SearchSupplierDialogProps) {
  const [open, setOpen] = useState(false);
  const [cnpj, setCnpj] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchedCnpj, setSearchedCnpj] = useState("");

  const {
    data: existingSupplier,
    isLoading,
    refetch,
  } = useSearchSupplierByCnpj(removeCnpjMask(cnpj));
  const associateMutation = useAssociateSupplier(orgId);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const maskedValue = applyCnpjMask(value);
    setCnpj(maskedValue);
  };

  const handleSearch = async () => {
    const cleanCnpj = removeCnpjMask(cnpj);
    if (!cleanCnpj || cleanCnpj.length !== 14) return;
    setSearchedCnpj(cnpj);
    await refetch();
  };

  const handleAssociate = async () => {
    if (!existingSupplier) return;
    try {
      await associateMutation.mutateAsync(existingSupplier.id);
      setOpen(false);
      setCnpj("");
      setSearchedCnpj("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error associating supplier:", error);
    }
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    setCnpj("");
    setSearchedCnpj("");
    setShowCreateForm(false);
  };

  const handleClose = () => {
    setOpen(false);
    setCnpj("");
    setSearchedCnpj("");
    setShowCreateForm(false);
  };

  const isCnpjValid = removeCnpjMask(cnpj).length === 14;

  return (
    <DrawerDialog
      action="Adicionar Fornecedor"
      isOpen={open}
      setIsOpen={setOpen}
      title="Adicionar Fornecedor"
      description="Procure por um fornecedor existente ou crie um novo."
    >
      <div className="space-y-6 px-4 md:px-0">
        {!showCreateForm ? (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cnpj">CNPJ do Fornecedor</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={handleCnpjChange}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    maxLength={18}
                  />
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={!isCnpjValid || isLoading}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {cnpj && !isCnpjValid && (
                  <p className="text-sm text-red-600 mt-1">
                    CNPJ deve ter 14 dígitos
                  </p>
                )}
              </div>

              {searchedCnpj && !isLoading && (
                <div className="space-y-4">
                  {existingSupplier ? (
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                          Fornecedor encontrado!
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Nome:</strong> {existingSupplier.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {existingSupplier.email}
                        </p>
                        <p>
                          <strong>Telefone:</strong> {existingSupplier.phone}
                        </p>
                        <p>
                          <strong>CNPJ:</strong> {existingSupplier.cnpj}
                        </p>
                        {existingSupplier.address && (
                          <p>
                            <strong>Endereço:</strong>{" "}
                            {existingSupplier.address}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleAssociate}
                        className="w-full mt-4"
                        disabled={associateMutation.isPending}
                      >
                        {associateMutation.isPending
                          ? "Associando..."
                          : "Associar à Organização"}
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center gap-2 text-yellow-700 mb-2">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">
                          Fornecedor não encontrado
                        </span>
                      </div>
                      <p className="text-sm text-yellow-600 mb-4">
                        Este fornecedor não existe no sistema. Você pode criá-lo
                        agora e ele ficará disponível para todas as
                        organizações.
                      </p>
                      <Button onClick={handleCreateNew} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Novo Fornecedor
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Criar Novo Fornecedor</span>
              </div>
              <p className="text-sm text-blue-600">CNPJ: {searchedCnpj}</p>
            </div>
            <SupplierForm
              organizationId={orgId}
              prefillCnpj={removeCnpjMask(searchedCnpj)}
              onSuccess={handleSuccess}
            />
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              className="w-full"
            >
              Voltar à Busca
            </Button>
          </div>
        )}
      </div>
    </DrawerDialog>
  );
}
