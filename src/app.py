"""
Streamlit UI for PodVibe.fm
"""

import streamlit as st
import sys
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add src to path
sys.path.append(os.path.dirname(__file__))

from youtube_summarizer import YouTubeSummarizer


def main():
    st.set_page_config(
        page_title="PodVibe.fm - AI Podcast Summarizer",
        page_icon="🎙️",
        layout="wide"
    )
    
    st.title("🎙️ PodVibe.fm")
    st.markdown("**AI-Powered Podcast Summarizer | Powered by Google Gemini**")
    st.markdown("---")
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        api_key = st.text_input(
            "Gemini API Key",
            type="password",
            help="Enter your Google Gemini API key",
            value=os.getenv('GEMINI_API_KEY', '')
        )
        
        summary_type = st.selectbox(
            "Summary Type",
            options=['comprehensive', 'brief', 'key_points'],
            help="Choose the type of summary you want"
        )
        
        st.markdown("---")
        st.markdown("### 📖 About")
        st.markdown("""
        This app uses:
        - **YouTube Transcript API** to fetch video transcripts
        - **Google Gemini** to generate intelligent summaries
        - **Agentic AI** pattern for step-by-step processing
        """)
    
    # Main content
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("🔗 Enter YouTube URL")
        youtube_url = st.text_input(
            "YouTube Video URL",
            placeholder="https://www.youtube.com/watch?v=...",
            help="Paste the URL of any YouTube video with available captions"
        )
    
    with col2:
        st.header("🚀 Actions")
        process_button = st.button("Generate Summary", type="primary", use_container_width=True)
    
    # Process video when button is clicked
    if process_button:
        if not api_key:
            st.error("❌ Please enter your Gemini API key in the sidebar")
            return
        
        if not youtube_url:
            st.error("❌ Please enter a YouTube URL")
            return
        
        try:
            # Initialize summarizer
            with st.spinner("🔧 Initializing AI agent..."):
                summarizer = YouTubeSummarizer(api_key=api_key)
            
            # Create progress container
            progress_container = st.container()
            
            with progress_container:
                st.markdown("### 🔄 Processing Steps")
                
                # Step 1: Extract video ID
                with st.spinner("📝 Step 1: Extracting video ID..."):
                    video_id = summarizer.extract_video_id(youtube_url)
                    st.success(f"✅ Video ID: `{video_id}`")
                
                # Step 2: Fetch transcript
                with st.spinner("📥 Step 2: Fetching transcript..."):
                    transcript = summarizer.get_transcript(video_id)
                    st.success(f"✅ Transcript fetched ({len(transcript):,} characters)")
                
                # Step 3: Generate summary
                with st.spinner(f"🤖 Step 3: Generating {summary_type} summary..."):
                    summary = summarizer.summarize_text(transcript, summary_type)
                    st.success("✅ Summary generated!")
            
            # Display results
            st.markdown("---")
            st.header("📊 Summary")
            
            # Create tabs for different views
            tab1, tab2, tab3 = st.tabs(["📝 Summary", "📄 Full Transcript", "🧠 Agent Memory"])
            
            with tab1:
                st.markdown(summary)
                
                # Download button
                st.download_button(
                    label="⬇️ Download Summary",
                    data=summary,
                    file_name=f"summary_{video_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
                    mime="text/plain"
                )
            
            with tab2:
                with st.expander("Show full transcript"):
                    st.text_area("Transcript", transcript, height=400)
            
            with tab3:
                st.markdown("### Agent Activity Log")
                
                # Show session summary
                session_summary = summarizer.get_session_summary()
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Total Events", session_summary['total_events'])
                with col2:
                    st.metric("Tasks Completed", session_summary.get('event_breakdown', {}).get('task_completed', 0))
                with col3:
                    st.metric("Tasks Failed", session_summary.get('event_breakdown', {}).get('task_failed', 0))
                
                st.markdown("---")
                
                # Show execution timeline
                st.markdown("#### Execution Timeline")
                timeline = summarizer.get_execution_timeline()
                for event in timeline:
                    with st.expander(f"🕐 {event['timestamp']} - {event['event']}"):
                        st.json(event['details'])
                
                # Full memory log
                st.markdown("#### Complete Memory Log")
                memory_log = summarizer.get_memory_log()
                for entry in memory_log:
                    with st.expander(f"{entry['event_type']} - {entry['timestamp']}"):
                        st.json(entry['data'])
            
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")
            st.exception(e)
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: gray;'>
    Built with ❤️ using Streamlit and Google Gemini | Agentic AI Hackathon Template
    </div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
