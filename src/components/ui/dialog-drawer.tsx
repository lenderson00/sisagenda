"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { IconPlus, type TablerIcon } from "@tabler/icons-react";
import { useEffect } from "react";

type DrawerDialogProps = {
  title: string;
  description: string;
  action: string;
  children: React.ReactNode;
  icon?: TablerIcon;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
};

export function DrawerDialog({
  title,
  description,
  action,
  children,
  icon,
  isOpen,
  setIsOpen,
}: DrawerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Icon = (icon as React.ElementType) ?? IconPlus;
  if (isDesktop) {
    return (
      <Dialog open={isOpen || open} onOpenChange={setIsOpen || setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            {" "}
            {<Icon className="mr-2" />} {action}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen || open} onOpenChange={setIsOpen || setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default">{action}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
