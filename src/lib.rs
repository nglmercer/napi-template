use napi::bindgen_prelude::*;
use napi_derive::napi;

// Simple enum for message types
#[napi]
pub enum MessageType {
    Info,
    Warning,
    Error,
    Success,
}

// Simple struct for messages
#[napi]
pub struct Message {
    pub content: String,
    pub rusttype: MessageType,
}

// Message constructor and methods
#[napi]
impl Message {
    #[napi(constructor)]
    pub fn new(content: String, rusttype: MessageType) -> Self {
        Message { content, rusttype }
    }

    #[napi]
    pub fn get_type_string(&self) -> String {
        match self.rusttype {
            MessageType::Info => "INFO".to_string(),
            MessageType::Warning => "WARN".to_string(),
            MessageType::Error => "ERROR".to_string(),
            MessageType::Success => "SUCCESS".to_string(),
        }
    }

    #[napi]
    pub fn get_formatted(&self) -> String {
        format!("[{}] {}", self.get_type_string(), self.content)
    }
}

// Simple synchronous functions
#[napi]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}

#[napi]
pub fn create_greeting(name: String, prefix: Option<String>) -> String {
    match prefix {
        Some(p) => format!("{} {}, welcome to NAPI!", p, name),
        None => format!("Hello {}, welcome to NAPI!", name),
    }
}

#[napi]
pub fn process_numbers(numbers: Vec<f64>) -> Vec<f64> {
    numbers.iter().map(|x| x * 2.0).collect()
}

// Simple async functions
#[napi]
pub async fn delayed_message(delay_ms: u32) -> String {
    let duration = std::time::Duration::from_millis(delay_ms.into());
    tokio::time::sleep(duration).await;
    "Success after delay".to_string()
}

#[napi]
pub async fn generate_sequence(start: u32, count: u32) -> Vec<u32> {
    let mut result = Vec::new();
    for i in 0..count {
        result.push(start + i);
        tokio::time::sleep(std::time::Duration::from_millis(1)).await;
    }
    result
}

// Error handling example
#[napi]
pub fn divide_numbers(numerator: f64, denominator: f64) -> Result<f64> {
    if denominator == 0.0 {
        return Err(napi::Error::from_reason("Division by zero"));
    }
    Ok(numerator / denominator)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_create_greeting() {
        let result = create_greeting("World".to_string(), None);
        assert_eq!(result, "Hello {}, welcome to NAPI!");
    }

    #[test]
    fn test_process_numbers() {
        let input = vec![1.0, 2.0, 3.0];
        let output = process_numbers(input);
        assert_eq!(output, vec![2.0, 4.0, 6.0]);
    }
}
