import { Camera } from "lucide-react"

export default function UploadTips() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <Camera className="h-3 w-3 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-1">Display Tips</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>
              • <strong>Cover:</strong> Best for profile photos - fills space and crops if needed
            </li>
            <li>
              • <strong>Contain:</strong> Shows entire image - may have empty space
            </li>
            <li>
              • <strong>Fill:</strong> Stretches image to exact dimensions - may distort
            </li>
            <li>
              • <strong>Circle:</strong> Perfect for profile pictures with round display
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
