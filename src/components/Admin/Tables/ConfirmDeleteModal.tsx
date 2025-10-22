"use client"

import { ArticleDTO } from "../../../../types/articles-type"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"


type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  article?: ArticleDTO
}

export default function ConfirmDeleteModal({ open, onClose, onConfirm, article }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <p>Voulez-vous vraiment supprimer l’article <strong>{article?.title}</strong> ?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="destructive" onClick={onConfirm}>Supprimer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
