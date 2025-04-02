/**
 * Utility functions for computer control with Cyberdesk API
 */


/**
 * Get a screenshot of the current display
 * @param desktopId The ID of the desktop instance
 * @param cyberdeskApiKey The Cyberdesk API key for authentication
 * @returns Base64 encoded PNG image data
 */
export async function getScreenshot(desktopId: string, cyberdeskApiKey: string): Promise<string> {
  try {
    const baseUrl = 'https://api.cyberdesk.io/v1';
    const response = await fetch(`${baseUrl}/desktop/${desktopId}/computer-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cyberdeskApiKey
      },
      body: JSON.stringify({
        type: 'screenshot'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get screenshot: ${error.message}`);
    }

    const data = await response.json();
    return data.image || ''; 
  } catch (error) {
    console.error('Error getting screenshot:', error);
    throw error;
  }
}

/**
 * Execute a computer action based on the provided parameters
 * @param action The action to perform (click, type, etc.)
 * @param desktopId The ID of the desktop instance
 * @param cyberdeskApiKey The Cyberdesk API key for authentication
 * @param coordinate The coordinates for actions that require a position
 * @param text The text for actions that require text input
 * @param duration The duration for wait actions (in seconds, converted to ms)
 * @param scroll_amount The number of clicks to scroll
 * @param scroll_direction The direction to scroll (up or down)
 * @param start_coordinate The starting coordinates for drag actions
 * @returns Result of the action, either a string or an object with image data
 */
export async function executeComputerAction(
  action: string,
  desktopId: string,
  cyberdeskApiKey: string,
  coordinate?: { x: number; y: number }, 
  text?: string,
  duration?: number,
  scroll_amount?: number,
  scroll_direction?: 'up' | 'down',
  start_coordinate?: { x: number; y: number }
): Promise<string | { type: "image"; data: string }> {
  try {
    const baseUrl = 'https://api.cyberdesk.io/v1';
    let requestBody: any = {};

    // Map the action to the API's expected format
    switch (action) {
      case 'left_click':
        requestBody = {
          type: 'left_click',
          x: coordinate?.x || 0,
          y: coordinate?.y || 0
        };
        break;
        
      case 'right_click':
        requestBody = {
          type: 'right_click',
          x: coordinate?.x || 0,
          y: coordinate?.y || 0
        };
        break;
        
      case 'middle_click':
        requestBody = {
          type: 'middle_click',
          x: coordinate?.x || 0,
          y: coordinate?.y || 0
        };
        break;
        
      case 'double_click':
        requestBody = {
          type: 'double_click'
        };
        break;
        
      case 'mouse_move':
        requestBody = {
          type: 'move_mouse',
          x: coordinate?.x || 0,
          y: coordinate?.y || 0
        };
        break;
        
      case 'left_mouse_down':
        requestBody = {
          type: 'mouse_press',
          button: 'left'
        };
        break;
        
      case 'left_mouse_up':
        requestBody = {
          type: 'mouse_release',
          button: 'left'
        };
        break;
        
      case 'scroll':
        requestBody = {
          type: 'scroll',
          direction: scroll_direction || 'down',
          amount: scroll_amount || 1
        };
        break;
        
      case 'type':
        requestBody = {
          type: 'write',
          text: text || ''
        };
        break;
        
      case 'key':
        requestBody = {
          type: 'press',
          keys: text || ''
        };
        break;
        
      case 'left_click_drag':
        if (start_coordinate && coordinate) {
          requestBody = {
            type: 'drag',
            start: {
              x: start_coordinate.x,
              y: start_coordinate.y
            },
            end: {
              x: coordinate.x,
              y: coordinate.y
            }
          };
        }
        break;
        
      case 'wait':
        requestBody = {
          type: 'wait',
          ms: (duration || 1) * 1000 // Convert seconds to milliseconds
        };
        break;
        
      case 'screenshot':
        requestBody = {
          type: 'screenshot'
        };
        break;
        
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    const response = await fetch(`${baseUrl}/desktop/${desktopId}/computer-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cyberdeskApiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to execute computer action: ${error.message}`);
    }

    const data = await response.json();
    
    if (data.image) {
      return {
        type: "image",
        data: data.image
      };
    }
    
    return data.status || 'Action completed successfully';
  } catch (error) {
    console.error(`Error executing computer action ${action}:`, error);
    throw error;
  }
}
