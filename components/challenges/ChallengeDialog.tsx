"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Challenge,
  createChallenge,
  updateChallenge,
} from "@/lib/couple-challenge-actions";
import { toast } from "sonner";
import { Flame, Clock, Calendar, Sparkles } from "lucide-react";

const challengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().default("fun"),
  difficulty: z.string().default("easy"),
  duration_days: z.preprocess((val) => Number(val), z.number().min(1)),
  due_at: z.string().optional().nullable(),
});

type ChallengeFormValues = z.infer<typeof challengeSchema>;

export function ChallengeDialog({
  open,
  onOpenChange,
  challenge,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge?: Challenge;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      category: "fun",
      difficulty: "easy",
      duration_days: 1,
      due_at: null,
    },
  });

  useEffect(() => {
    if (challenge) {
      form.reset({
        title: challenge.title,
        description: challenge.description || "",
        category: challenge.category,
        difficulty: challenge.difficulty,
        duration_days: challenge.duration_days,
        due_at: challenge.due_at
          ? new Date(challenge.due_at).toISOString().split("T")[0]
          : null,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        category: "fun",
        difficulty: "easy",
        duration_days: 1,
        due_at: null,
      });
    }
  }, [challenge, form, open]);

  const onSubmit = async (values: ChallengeFormValues) => {
    setIsSubmitting(true);
    try {
      const result = challenge
        ? await updateChallenge(challenge.id, values)
        : await createChallenge(values);

      if (result.success) {
        toast.success(challenge ? "Challenge updated!" : "Challenge created!");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] border-rose-100 shadow-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <div className="bg-pink-600 p-6 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold">
              {challenge ? "Edit Challenge" : "New Challenge"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rose-600 font-bold text-xs uppercase tracking-wider">
                    Challenge Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Cook dinner together 🍳"
                      {...field}
                      className="rounded-xl border-rose-100 focus-visible:ring-pink-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rose-600 font-bold text-xs uppercase tracking-wider">
                    Details (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What counts as completing this?"
                      {...field}
                      className="rounded-xl border-rose-100 focus-visible:ring-pink-400 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-rose-600 font-bold text-xs uppercase tracking-wider">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-rose-100">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="fun">🎉 Fun</SelectItem>
                        <SelectItem value="romantic">💕 Romantic</SelectItem>
                        <SelectItem value="growth">🌱 Growth</SelectItem>
                        <SelectItem value="adventure">🗺️ Adventure</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-rose-600 font-bold text-xs uppercase tracking-wider">
                      Difficulty
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-rose-100">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-rose-600 font-bold text-xs uppercase tracking-wider">
                      Days to complete
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300" />
                        <Input
                          type="number"
                          {...field}
                          className="rounded-xl border-rose-100 pl-9 focus-visible:ring-pink-400"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-rose-600 font-bold text-xs uppercase tracking-wider">
                      Target Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300" />
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          className="rounded-xl border-rose-100 pl-9 focus-visible:ring-pink-400 appearance-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold h-12 shadow-lg shadow-pink-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving Challenge...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5" />
                    {challenge ? "Update Flame" : "Start Challenge"}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
