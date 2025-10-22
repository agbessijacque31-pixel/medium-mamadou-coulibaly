"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { videoTemoignageFormSchema, VideoTemoignageFormValues } from "@/lib/Schemas/articleSchema";
import { ImageValue, VideoTemoignageDTO } from "../../../../types/articles-type";


type AppendableValue = File | ImageValue | null | undefined;

/**
 * Valeurs par défaut du formulaire de témoignage vidéo
 */
function getDefaultValues(initialData?: VideoTemoignageDTO): VideoTemoignageFormValues {
    return {
        id: initialData?.id,
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
        transcript: initialData?.transcript ?? "",
        videotemoi: initialData?.videotemoi ?? null,
        webmtemoi: initialData?.webmtemoi ?? null,
        thumbnailtemoi: initialData?.thumbnailtemoi ?? null,
        subtitlestemoi: initialData?.subtitlestemoi ?? null,
    };
}

/**
 * Hook principal pour le formulaire de témoignage vidéo
 */
export function useTemoignageVideoForm(initialData?: VideoTemoignageDTO) {
    // ✅ Correction du resolver (TypeScript)
    const resolver = zodResolver(videoTemoignageFormSchema) as Resolver<VideoTemoignageFormValues>;


    const form = useForm<VideoTemoignageFormValues>({
        resolver,
        defaultValues: getDefaultValues(initialData),
    });

    const {  reset,formState } = form;


    // Reset si initialData change
    useEffect(() => {
        if (initialData) reset(getDefaultValues(initialData));
    }, [initialData, reset]);

    /**
     * Soumission du formulaire : construit un FormData à envoyer à ton endpoint
     */
    const onSubmit: SubmitHandler<VideoTemoignageFormValues> = async (data) => {
        const formData = new FormData();

        formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.transcript) formData.append("transcript", data.transcript);

        // ✅ Gestion des fichiers ou objets Cloudinary
        const handleFileAppend = (key: string, value: AppendableValue) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value && typeof value === "object") {
                formData.append(key, JSON.stringify(value));
            }
            
        };

        handleFileAppend("videotemoi", data.videotemoi);
        handleFileAppend("webmtemoi", data.webmtemoi);
        handleFileAppend("thumbnailtemoi", data.thumbnailtemoi);
        handleFileAppend("subtitlestemoi", data.subtitlestemoi);

        return formData;
    };

    return { ...form, onSubmit,formState };
}



