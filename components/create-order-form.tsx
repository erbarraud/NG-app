"use client"

import { useState } from "react"
import { useForm, FormProvider, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  speciesOptions,
  dryStatusOptions,
  shiftOptions,
  existingSortTemplates,
  defaultOrderValues,
  defaultNewSortValues,
  type OrderFormValues,
  type SortTemplate,
  type Species, // Ensure types are imported
  type DryStatus,
  type Shift,
} from "@/lib/data/order-form-data"
import { SortDefinitionItem } from "./sort-definition-item"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const positiveNumberOptional = z.number().positive("Must be a positive number").optional().or(z.literal("")).or(z.nan())

const newSortSchema = z
  .object({
    id: z.string(),
    sortName: z.string().min(1, "Sort name is required"),
    grades: z.string().min(1, "Grade is required"), // Changed to string
    aspect: z.string().min(1, "Lumber Stage is required"),
    boardAspectSelection: z.string().min(1, "Board aspect selection is required"),
    enableColorSorting: z.string().refine((val) => val === "enabled" || val === "disabled", {
      // Changed to string enum
      message: "Please select if color sorting is enabled or disabled.",
    }),
    selectedColorCategories: z.string().optional(), // Changed to string, optional
    customLogicTag: z.string().optional(),
    commercialWidth: z
      .number({ invalid_type_error: "Width must be a number" })
      .positive("Width must be positive")
      .optional()
      .or(z.nan()),
    commercialWidthTolerance: positiveNumberOptional,
    commercialLength: z
      .number({ invalid_type_error: "Length must be a number" })
      .positive("Length must be positive")
      .optional()
      .or(z.nan()),
    commercialLengthTolerance: positiveNumberOptional,
  })
  .refine(
    (data) => {
      if (data.enableColorSorting === "enabled") {
        return data.selectedColorCategories && data.selectedColorCategories.trim() !== ""
      }
      return true
    },
    {
      message: "If color sorting is enabled, a color category is required.",
      path: ["selectedColorCategories"],
    },
  )

const orderFormSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  orderName: z.string().min(1, "Order name is required"),
  species: z.string({ required_error: "Species is required." }).min(1, "Species is required") as z.ZodType<Species>,
  dryStatus: z.string().min(1, "Dry status is required") as z.ZodType<DryStatus>,
  productionDate: z.date({ required_error: "Production date is required." }),
  productionShift: z.string().optional() as z.ZodType<Shift | undefined>,
  customer: z.string().optional(),
  selectedSortTemplateIds: z.array(z.string()).optional(),
  newSorts: z.array(newSortSchema).optional(),
})

interface CreateOrderFormProps {
  isPageContext?: boolean
  onFormSubmitSuccess?: (data: OrderFormValues) => void
  onCancel?: () => void
}

export function CreateOrderForm({ isPageContext = false, onFormSubmitSuccess, onCancel }: CreateOrderFormProps) {
  const { toast } = useToast()
  const [templateSelectPopoverOpen, setTemplateSelectPopoverOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const router = useRouter()

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { ...defaultOrderValues },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "newSorts" })

  function onSubmit(data: OrderFormValues) {
    const processedData = {
      ...data,
      newSorts: data.newSorts?.map((sort) => ({
        ...sort,
        // No complex processing needed for selectedColorCategories as custom input is removed
        commercialWidth: Number(sort.commercialWidth) || undefined,
        commercialWidthTolerance: Number(sort.commercialWidthTolerance) || undefined,
        commercialLength: Number(sort.commercialLength) || undefined,
        commercialLengthTolerance: Number(sort.commercialLengthTolerance) || undefined,
      })),
    }
    console.log("Order Submitted:", processedData)
    toast({
      title: `Order ${isPageContext ? "Saved" : "Created"} Successfully!`,
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(
              {
                orderId: processedData.orderId,
                orderName: processedData.orderName,
                species: processedData.species,
                productionDate: processedData.productionDate
                  ? format(processedData.productionDate, "yyyy-MM-dd")
                  : "N/A",
              },
              null,
              2,
            )}
          </code>
        </pre>
      ),
    })
    if (onFormSubmitSuccess) onFormSubmitSuccess(processedData)
  }

  const handleAddBlankCustomSort = () => append({ ...defaultNewSortValues, id: uuidv4() })

  const handleStartCustomSortFromTemplate = (template: SortTemplate) => {
    append({
      ...defaultNewSortValues, // Start with defaults
      id: uuidv4(),
      sortName: `${template.templateName} (Customized)`,
      grades: template.grades || defaultNewSortValues.grades, // template.grades is now string
      aspect: template.aspect ?? defaultNewSortValues.aspect,
      boardAspectSelection: template.boardAspectSelection ?? defaultNewSortValues.boardAspectSelection,
      enableColorSorting: template.enableColorSorting ?? defaultNewSortValues.enableColorSorting, // template.enableColorSorting is now string
      selectedColorCategories: template.selectedColorCategories ?? defaultNewSortValues.selectedColorCategories, // template.selectedColorCategories is now string
      customLogicTag: template.customLogicTag ?? "",
      commercialWidth: template.commercialWidth,
      commercialWidthTolerance: template.commercialWidthTolerance,
      commercialLength: template.commercialLength,
      commercialLengthTolerance: template.commercialLengthTolerance,
    })
    setTemplateSelectPopoverOpen(false)
  }

  const orderInfoSection = (
    <section className="space-y-6">
      {isPageContext && <h3 className="text-xl font-semibold pb-2 border-b">Order Information</h3>}
      {!isPageContext && (
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-background z-10">
          <DialogTitle className="text-2xl">Create New Order</DialogTitle>
          <DialogDescription>Fill in the details below to create a new production order.</DialogDescription>
        </DialogHeader>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ORD-20250605-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="orderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Name / Label</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Soft Maple - Monday Shift" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="species"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Species</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {speciesOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField
          control={form.control}
          name="productionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Production Date</FormLabel>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    onClick={() => setDatePickerOpen(!datePickerOpen)}
                  >
                    {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date)
                      setDatePickerOpen(false)
                    }}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000)}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dryStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dry Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dry status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dryStatusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField
          control={form.control}
          name="productionShift"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shiftOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  )

  const formFieldsContent = (
    <>
      {orderInfoSection}
      <Separator className={cn(isPageContext ? "my-10" : "my-6")} />
      <section className="space-y-6">
        <h3 className={cn("text-xl font-semibold pb-2", isPageContext ? "border-b" : "")}>
          Sort Definitions for This Order
        </h3>
        <Tabs defaultValue="customSorts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existingTemplates">Link Existing Templates (Use As-Is)</TabsTrigger>
            <TabsTrigger value="customSorts">Define Custom Sorts</TabsTrigger>
          </TabsList>
          <TabsContent value="existingTemplates" className="pt-4">
            <FormField
              control={form.control}
              name="selectedSortTemplateIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Select global templates to associate with this order. They will be used as defined and cannot be
                    edited here.
                  </FormLabel>
                  <div className="space-y-2 pt-2 max-h-72 overflow-y-auto pr-2 mt-2">
                    {existingSortTemplates.length > 0 ? (
                      existingSortTemplates.map((t) => (
                        <Card key={t.templateId} className="p-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`t-${t.templateId}`}
                              checked={field.value?.includes(t.templateId)}
                              onCheckedChange={(c) => {
                                const v = field.value || []
                                field.onChange(c ? [...v, t.templateId] : v.filter((id) => id !== t.templateId))
                              }}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor={`t-${t.templateId}`} className="font-medium cursor-pointer">
                                {t.templateName}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Grade: {t.grades || "N/A"}, Aspect: {t.aspect || "N/A"}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No existing sort templates found.
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="customSorts" className="pt-4 space-y-4">
            <div>
              <Label className="text-sm font-normal text-muted-foreground">
                Create new custom sort definitions for this order. You can start from scratch or use an existing
                template as a base.
              </Label>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <Button type="button" variant="outline" onClick={handleAddBlankCustomSort} className="flex-1">
                  <PlusCircle className="mr-2 h-4 w-4" /> Start with Blank Definition
                </Button>
                <Popover open={templateSelectPopoverOpen} onOpenChange={setTemplateSelectPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setTemplateSelectPopoverOpen(!templateSelectPopoverOpen)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Start from Existing Template
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search templates..." />
                      <CommandList>
                        <CommandEmpty>No templates found.</CommandEmpty>
                        {existingSortTemplates.map((t) => (
                          <CommandItem
                            key={t.templateId}
                            value={t.templateName}
                            onSelect={() => handleStartCustomSortFromTemplate(t)}
                            onClick={() => handleStartCustomSortFromTemplate(t)} // Retaining explicit onClick for CommandItem fix
                            className="cursor-pointer"
                          >
                            {t.templateName}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {fields.length > 0 && <Separator className="my-6" />}
            {fields.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Your Custom Sort Definitions ({fields.length}):
                </Label>
                <div className="space-y-4">
                  {fields.map((item, index) => (
                    <SortDefinitionItem
                      key={item.id}
                      index={index}
                      onRemove={remove}
                      control={form.control}
                      parentFieldName={`newSorts.${index}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </>
  )

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-8", !isPageContext && "p-1 max-h-[85vh] overflow-y-auto")}
        >
          <div className={cn(!isPageContext ? "px-6 py-1 space-y-8" : "space-y-10")}>{formFieldsContent}</div>
          {!isPageContext && (
            <DialogFooter className="px-6 pb-6 pt-2 sticky bottom-0 bg-background z-10 border-t">
              <Button type="button" variant="outline" onClick={onCancel || (() => console.log("Cancel Clicked"))}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Order"}
              </Button>
            </DialogFooter>
          )}
          {isPageContext && (
            <div className="flex justify-end space-x-2 pt-8 border-t mt-12">
              <Button type="button" variant="outline" onClick={onCancel || (() => router.back())}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Order"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </FormProvider>
  )
}
