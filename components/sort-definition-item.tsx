"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Trash2, Info } from "lucide-react" // Removed Check, ChevronsUpDown as they are part of Select
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// RadioGroup, Switch, Popover, Command components are removed as they are replaced by Select
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"; // cn might not be needed anymore if Check is gone
import {
  sortGradeOptions,
  sortAspectOptions,
  boardAspectSelectionOptions,
  colorCategoryOptions, // Using the updated one (without "Custom" if modified in data file)
  enableDisableOptions, // New options for Enable/Disable select
  type SortGrade,
  type SortAspect,
  type ColorCategory,
  type BoardAspectSelection,
} from "@/lib/data/order-form-data"
// useState for popovers is removed

interface SortDefinitionItemProps {
  index: number
  onRemove: (index: number) => void
  control: any // Control type from react-hook-form
  parentFieldName: string
}

export function SortDefinitionItem({ index, onRemove, control, parentFieldName }: SortDefinitionItemProps) {
  const { setValue } = useFormContext() // getValues might not be needed
  const fieldName = (name: string) => `${parentFieldName}.${name}` as const

  // Watch the value of 'enableColorSorting' to conditionally render 'selectedColorCategories'
  const enableColorSortingValue = useWatch({
    control,
    name: fieldName("enableColorSorting"),
  })

  return (
    <Card className="bg-muted/30">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
        <CardTitle className="text-base font-medium">Custom Sort #{index + 1}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive"
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <FormField
          control={control}
          name={fieldName("sortName")}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Sort Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Premium Maple FAS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Grades: Changed to Select */}
        <FormField
          control={control}
          name={fieldName("grades")}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Grade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sortGradeOptions.map((option: SortGrade) => (
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

        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2 mb-2">
            <FormLabel className="text-sm font-medium">Commercial Dimensions</FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Specify target commercial dimensions and manufacturing tolerances in millimeters (mm).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0 p-3 border rounded-md bg-background/50">
            <div className="space-y-4">
              <FormField
                control={control}
                name={fieldName("commercialWidth")}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Width (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 80"
                        className="w-32"
                        aria-label="Target commercial width in millimeters"
                        {...field}
                        value={field.value === undefined || Number.isNaN(field.value) ? "" : field.value}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={fieldName("commercialWidthTolerance")}
                render={({ field: t }) => (
                  <FormItem>
                    <FormLabel className="text-xs">± Tolerance (mm)</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 5"
                              className="w-32"
                              aria-label="Enter width tolerance in millimeters (plus/minus value)"
                              {...t}
                              value={t.value === undefined || Number.isNaN(t.value) ? "" : t.value}
                              onChange={(e) =>
                                t.onChange(e.target.value === "" ? undefined : Number.parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The allowed variation for the width. E.g., enter 5 for ±5mm.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={control}
                name={fieldName("commercialLength")}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Length (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 2400"
                        className="w-32"
                        aria-label="Target commercial length in millimeters"
                        {...field}
                        value={field.value === undefined || Number.isNaN(field.value) ? "" : field.value}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={fieldName("commercialLengthTolerance")}
                render={({ field: t }) => (
                  <FormItem>
                    <FormLabel className="text-xs">± Tolerance (mm)</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 10"
                              className="w-32"
                              aria-label="Enter length tolerance in millimeters (plus/minus value)"
                              {...t}
                              value={t.value === undefined || Number.isNaN(t.value) ? "" : t.value}
                              onChange={(e) =>
                                t.onChange(e.target.value === "" ? undefined : Number.parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The allowed variation for the length. E.g., enter 10 for ±10mm.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Lumber Stage (Aspect): Changed to Select */}
        <FormField
          control={control}
          name={fieldName("aspect")}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Lumber Stage</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lumber stage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sortAspectOptions.map((option: SortAspect) => (
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

        <FormField
          control={control}
          name={fieldName("boardAspectSelection")}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Board Aspect Selection</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board aspect" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {boardAspectSelectionOptions.map((option: BoardAspectSelection) => (
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

        {/* Enable Color Sorting: Changed to Select */}
        <FormField
          control={control}
          name={fieldName("enableColorSorting")}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Enable Color Sorting</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value === "disabled") {
                    setValue(fieldName("selectedColorCategories"), "", { shouldValidate: true })
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Set color sorting" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {enableDisableOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-xs text-muted-foreground pt-1">
                Set to "Enabled" to define a color category for this sort.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color Categories: Changed to Select, conditional rendering */}
        {enableColorSortingValue === "enabled" && (
          <FormField
            control={control}
            name={fieldName("selectedColorCategories")}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Color Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colorCategoryOptions.map((option: ColorCategory) => (
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
        )}
        {/* Custom Color Category Input is removed */}

        <FormField
          control={control}
          name={fieldName("customLogicTag")}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Custom Logic Tag (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., EXPORT_GRADE_A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
