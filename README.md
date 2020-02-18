# Figma Export

Create a config.json file with the follow content:

```
{
  "TOKEN": "<YOUR TOKEN HERE>",
  "URL": "https://api.figma.com/v1"
}
```

After that, just run
```
# node index.js  <OPTIONS> <FIGMA_FILE_ID>
```

### Options available
```
 -d     Create and export to the folder (Optional) (Default: ./)
 -f     Specify the export format (Optional) (Default: svg)