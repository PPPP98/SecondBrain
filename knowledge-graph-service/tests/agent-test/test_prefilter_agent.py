# tests/test_pre_filter_2way.py
import asyncio
from app.agents.search_agent.nodes import Nodes
from app.agents.search_agent.state import State

async def test_2way_pre_filter():
    """2-way Pre-Filter 테스트"""
    
    test_cases = [
        {
            "query": "어제 작성한 노트",
            "expected_type": "simple_lookup",
        },
        {
            "query": "오늘 쓴 거",
            "expected_type": "simple_lookup",
        },
        {
            "query": "AI 알고리즘",
            "expected_type": "similarity",
        },
        {
            "query": "어제 React Hook 사용법",
            "expected_type": "similarity",
        },
        {
            "query": "프론트엔드 성능 최적화 방법",
            "expected_type": "similarity",
        },
    ]
    
    print(f"\n{'='*80}")
    print(f"🧪 2-Way Pre-Filter 테스트")
    print(f"{'='*80}\n")
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n[{i}] {test['query']}")
        print(f"{'='*80}")
        
        state: State = {
            "query": test["query"],
            "user_id": 123,
            "authorizations": "Bearer test"
        }
        
        result = await Nodes.pre_filter_node(state)
        
        print(f"📌 원본: {result['original_query']}")
        print(f"🔀 타입: {result['search_type']}")
        
        if result['filters'].get('timespan'):
            print(f"📅 시간: {result['filters']['timespan']['description']}")
        
        if result['search_type'] == 'similarity':
            print(f"✏️  재작성: {result['query']}")
        
        # 검증
        if result['search_type'] == test['expected_type']:
            print(f"✅ 통과")
        else:
            print(f"❌ 실패 ({result['search_type']} != {test['expected_type']})")

if __name__ == "__main__":
    asyncio.run(test_2way_pre_filter())
