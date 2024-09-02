# Custom file editing
# To prep index.html & index.js to be built for webpack
# Middle step to automate the whole minification process for js13k (2024)
# Called by build.bat one directory up

$filePath = "./src/index.html"
$lineNumberToCommentA = 8
$lineNumberToCommentB = 9

$filePathJS = "./src/i.js"
$lineNumberToReplace = 4
$newLineContent = "import './style.css';"

Write-Output "Starting replace_line.ps1 Script ..."

# Read file (index.html)
$content = Get-Content -Path $filePath

# Check file has enough lines
if ($lineNumberToCommentA -le $content.Length) {
        
    # Get the line A to comment out
    $lineToComment = $content[$lineNumberToCommentA - 1]

    # Comment out the line by prepending <!-- and -->
    $commentedLine = "<!-- $lineToComment -->"
    
    # Replace the specified line with the commented version
    $content[$lineNumberToCommentA - 1] = $commentedLine

    # Write the modified content back to file
    $content | Set-Content -Path $filePath

    Write-Output "Line $lineNumberToCommentA of index.html has been commented out successfully!"

} else {
    Write-Output "Error in PS process: The file does not have $lineNumberToCommentA lines."
}

# Check file has enough lines
if ($lineNumberToCommentB -le $content.Length) {
        
    # Get the line to comment out
    $lineToComment = $content[$lineNumberToCommentB - 1]

    # Comment out the line by prepending <!-- and -->
    $commentedLine = "<!-- $lineToComment -->"
    
    # Replace the specified line with the commented version
    $content[$lineNumberToCommentB - 1] = $commentedLine

    # Write the modified content back to file
    $content | Set-Content -Path $filePath

    Write-Output "Line $lineNumberToCommentB of index.html has been commented out successfully!"
} else {
    Write-Output "Error in PS process: The file does not have $lineNumberToCommentB lines."
}

# Check index.JS file exists
if (Test-Path $filePathJS) {
    # Read the content of the file
    $content = Get-Content -Path $filePathJS

    # Check if the file has enough lines
    if ($lineNumberToReplace -le $content.Length) {
        # Replace the specified line
        $content[$lineNumberToReplace - 1] = $newLineContent

        # Write the modified content back to the file
        $content | Set-Content -Path $filePathJS

        Write-Output "index.js line $lineNumberToReplace has been replaced with: $newLineContent successfully!"
    } else {
        Write-Output "The file index.js does not have $lineNumberToReplace lines."
    }
} else {
    Write-Output "Error in PS process: The file at $filePathJS does not exist."
}

Write-Output "End of replace_line.ps1 ... continuing"