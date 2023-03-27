const colorSet = [
    {color: "black"},
    {color: "darkslategrey"},
    {color: "dimgrey"},
    {color: "grey"},
    {color: "lightgrey"},
    {color: "beige"},
    {color: "white"},
    {color: "maroon"},
    {color: "saddlebrown"},
    {color: "darkgoldenrod"},
    {color: "goldenrod"},
    {color: "rosybrown"},
    {color: "wheat"},
    {color: "navy"},
    {color: "blue"},
    {color: "dodgerblue"},
    {color: "deepskyblue"},
    {color: "aquamarine"},
    {color: "cyan"},
    {color: "olive"},
    {color: "darkgreen"},
    {color: "green"},
    {color: "springgreen"},
    {color: "limegreen"},
    {color: "palegreen"},
    {color: "lime"},
    {color: "greenyellow"},
    {color: "darkslateblue"},
    {color: "slateblue"},
    {color: "purple"},
    {color: "fuchsia"},
    {color: "plum"},
    {color: "orchid"},
    {color: "lavender"},
    {color: "darkkhaki"},
    {color: "khaki"},
    {color: "lemonchiffon"},
    {color: "yellow"},
    {color: "gold"},
    {color: "orangered"},
    {color: "orange"},
    {color: "coral"},
    {color: "lightpink"},
    {color: "palevioletred"},
    {color: "deeppink"},
    {color: "darkred"},
    {color: "crimson"},
    {color: "red"}       
  ];
  
  const options = [
    ['Steps Color', 'stepsColor'],
    ['Date Color', 'dateColor'],
    ['Clock Numbers', 'clockNumbersColor'],
    ['HRM Text Color', 'colorHRM'],
    ['Minute Hand', 'minColor'],
    ['Hour Hand', 'hourColor'],
    ['Second Hand', 'secondsColor'],
  ];

function mySettings(props) {
    let screenWidth = props.settingsStorage.getItem("screenWidth");
    let screenHeight = props.settingsStorage.getItem("screenHeight");
  
    return (
        <Page>
         <Section
          title="Wallpaper">
          <ImagePicker
            description="Pick an image to use as your wallpaper."
            label="Pick a Wallpaper Image"
            sublabel="Wallpaper image picker"
            settingsKey="wallpaper-image"
            imageWidth={ screenWidth }
            imageHeight={ screenHeight }
          />
          </Section>
           {options.map(([title, settingsKey]) =>
            <Section
              title={title}>
              <ColorSelect
                settingsKey={settingsKey}
                colors={colorSet} />
            </Section>
            )}
        </Page>     
    );
  }
  
  registerSettingsPage(mySettings);

