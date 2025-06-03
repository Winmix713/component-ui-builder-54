
export const generateCodeFromProps = (
  componentType: string, 
  props: Record<string, any>, 
  fallbackCode: string
): string => {
  switch (componentType) {
    case 'button':
      return `function ComponentDemo() {
  return (
    <Button${props.variant !== 'default' ? ` variant="${props.variant}"` : ''}${props.size !== 'default' ? ` size="${props.size}"` : ''}${props.disabled ? ' disabled' : ''}>
      ${props.children || 'Button'}
    </Button>
  )
}`;
    case 'card':
      return `function ComponentDemo() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>${props.title || 'Card Title'}</CardTitle>
        <CardDescription>${props.description || 'Card Description'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>${props.content || 'Card Content'}</p>
      </CardContent>
    </Card>
  )
}`;
    case 'input':
      return `function ComponentDemo() {
  return (
    <Input${props.type !== 'text' ? ` type="${props.type}"` : ''}${props.placeholder ? ` placeholder="${props.placeholder}"` : ''}${props.disabled ? ' disabled' : ''} />
  )
}`;
    case 'checkbox':
      return `function ComponentDemo() {
  const [checked, setChecked] = useState(${props.checked || false});
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="demo"
        checked={checked}
        onCheckedChange={setChecked}${props.disabled ? '\n        disabled' : ''}
      />
      <label htmlFor="demo">${props.label || 'Accept terms and conditions'}</label>
    </div>
  )
}`;
    case 'navigation-menu':
      return `function ComponentDemo() {
  return (
    <div className="p-4">
      <p className="text-center">Navigation Menu component</p>
      <p className="text-sm text-muted-foreground text-center mt-2">
        Component playground for Navigation Menu
      </p>
    </div>
  )
}`;
    default:
      return fallbackCode;
  }
};
