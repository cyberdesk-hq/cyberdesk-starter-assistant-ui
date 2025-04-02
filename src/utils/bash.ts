/**
 * Utility functions for bash command execution with Cyberdesk API
 */

/**
 * Execute a bash command
 * @param command The command to execute
 * @param desktopId The ID of the desktop instance
 * @param cyberdeskApiKey The Cyberdesk API key for authentication
 * @returns The command output as a string
 */
export async function executeBashCommand(
  command: string, 
  desktopId: string, 
  cyberdeskApiKey: string
): Promise<string> {
  try {
    const baseUrl = 'https://api.cyberdesk.io/v1';
    const response = await fetch(`${baseUrl}/desktop/${desktopId}/bash-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cyberdeskApiKey
      },
      body: JSON.stringify({
        command
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to execute bash command: ${error.message}`);
    }

    const data = await response.json();
    return data.output || '';
  } catch (error) {
    console.error(`Error executing bash command "${command}":`, error);
    return 'Error executing bash command' + "\n" + (error as Error).message;
  }
}
