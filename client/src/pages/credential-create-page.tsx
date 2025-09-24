import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import type z from "zod"
import { createCredential } from "../api/createCredential"
import { IssuerFormSelect } from "../components/issuer-form-select"
import { Button } from "../components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { createVCSchema } from "../lib/schemas"
import { cn } from "../lib/utils"

export function CredentialCreatePage() {
  const navigateTo = useNavigate()
  const form = useForm<z.infer<typeof createVCSchema>>({
    resolver: zodResolver(createVCSchema),
    defaultValues: {
      type: "ExampleCredential",
      claims: [{ key: "", value: "" }],
      subject: "",
      issuer: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "claims",
  })

  const handleSubmit = async (data: z.infer<typeof createVCSchema>) => {
    const { claims, ...rest } = data
    const claimsObject = claims.reduce((obj, item) => {
      obj[item.key] = item.value
      return obj
    }, {} as Record<string, string>)

    try {
      await createCredential({ claims: claimsObject, ...rest })
      navigateTo("/")
    } catch (error) {
      console.error("Failed to create credential:", error)
    }
  }

  return (
    <div className="text-start space-y-12 w-lg mx-auto">
      <div className="flex items-center gap-4">
        <Button title="back to previous page" onClick={() => navigateTo(-1)} size={"icon"} variant={"outline"}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Create new Credential</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 mx-auto">
          <FormField
            control={form.control}
            name={`type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={"Type"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <IssuerFormSelect name="issuer" label="Issuer" placeholder="Select an issuer" />
          <IssuerFormSelect name="subject" label="Subject" placeholder="Select a subject" />
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`claims.${index}.key`}
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel className={cn(index > 0 && "sr-only")}>Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={"key"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`claims.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel className={cn(index > 0 && "sr-only")}>Value</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={"value"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  title="delete key-value pair"
                  type="button"
                  size={"icon"}
                  variant="destructive"
                  className={cn(index === 0 && "mt-5.5")}
                  onClick={() => remove(index)}
                >
                  <Trash />
                </Button>
              </div>
            ))}
            <Button
              title="Add new key-value pair"
              type="button"
              size={"icon"}
              variant="outline"
              onClick={() => append({ key: "", value: "" })}
            >
              <Plus />
            </Button>
          </div>

          <Button type="submit">Create new credential</Button>
        </form>
      </Form>
    </div>
  )
}
